<?php

namespace App\Http\Controllers\Api\V2\Hrm;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use App\Models\User;
use App\Models\JournalEntry;
use App\Models\JournalItem;
use App\Models\ChartOfAccount;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    use ApiResponse;

    /**
     * 1. List Payrolls (Filter by Month, User, Status)
     */
    public function index(Request $request)
    {
        $query = Payroll::with(['user:id,name', 'user.profile:user_id,designation,department_id', 'user.profile.department']);

        // Admin can filter by specific user
        if ($request->has('user_id') && in_array(auth()->user()->role_id, [1, 2])) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->month_year) {
            $query->where('month_year', $request->month_year);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Staff can only see their own (unless admin already filtered by user_id above)
        if (!in_array(auth()->user()->role_id, [1, 2])) {
            $query->where('user_id', auth()->id());
        }

        return $this->sendSuccess($query->paginate(20));
    }

    /**
     * 2. Generate Salary Sheet for a Month (Admin Only)
     */
    public function generate(Request $request)
    {
        $request->validate([
            'month_year' => 'required|date_format:Y-m', // e.g. "2025-01"
        ]);

        $month = $request->month_year;

        // Check if already generated
        if (Payroll::where('month_year', $month)->exists()) {
            return $this->sendError("Payroll for {$month} is already generated.");
        }

        // Get All Active Staff (Excluding Customers)
        $staffs = User::with('profile')
            ->whereHas('role', fn($q) => $q->whereNotIn('slug', ['retail_customer', 'wholesale_customer']))
            ->where('is_active', true)
            ->get();

        if ($staffs->isEmpty()) {
            return $this->sendError('No active staff found to generate payroll.');
        }

        DB::beginTransaction();
        try {
            $count = 0;
            foreach ($staffs as $staff) {
                // Skip if no profile or salary set
                $baseSalary = $staff->profile->base_salary ?? 0;
                if ($baseSalary <= 0) continue;

                Payroll::create([
                    'user_id' => $staff->id,
                    'month_year' => $month,
                    'basic_salary' => $baseSalary,
                    'bonus' => 0,
                    'deductions' => 0,
                    'net_payable' => $baseSalary, // Initially same as Basic
                    'status' => 'generated'
                ]);
                $count++;
            }

            DB::commit();
            return $this->sendSuccess(null, "Payroll generated for {$count} employees for month {$month}");

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * 3. Update Individual Payroll (Add Bonus/Deduction)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'bonus' => 'numeric|min:0',
            'deductions' => 'numeric|min:0'
        ]);

        $payroll = Payroll::findOrFail($id);

        if ($payroll->status === 'paid') {
            return $this->sendError('Cannot update paid payroll.');
        }

        $bonus = $request->bonus ?? $payroll->bonus;
        $deductions = $request->deductions ?? $payroll->deductions;
        
        $netPayable = ($payroll->basic_salary + $bonus) - $deductions;

        $payroll->update([
            'bonus' => $bonus,
            'deductions' => $deductions,
            'net_payable' => $netPayable
        ]);

        return $this->sendSuccess($payroll, 'Payroll adjusted successfully');
    }

    /**
     * 4. Make Payment & Accounting Entry
     */
    public function pay($id)
    {
        $payroll = Payroll::with('user')->findOrFail($id);

        if ($payroll->status === 'paid') {
            return $this->sendError('Already paid.');
        }

        DB::beginTransaction();
        try {
            // A. Update Status
            $payroll->update([
                'status' => 'paid',
                'payment_date' => now()
            ]);

            // B. Accounting Journal Entry
            // Debit: Salary Expense (5003), Credit: Cash (1001)
            $expenseAcc = ChartOfAccount::where('code', '5003')->first(); // Salary Expense
            $cashAcc = ChartOfAccount::where('code', '1001')->first();    // Cash on Hand

            if ($expenseAcc && $cashAcc) {
                $je = JournalEntry::create([
                    'entry_number' => 'SAL-' . $payroll->month_year . '-' . $payroll->id,
                    'date' => now(),
                    'description' => "Salary Payment to {$payroll->user->name} for {$payroll->month_year}",
                    'reference_type' => Payroll::class,
                    'reference_id' => $payroll->id,
                    'created_by' => auth()->id() ?? 1
                ]);

                // Debit Expense
                JournalItem::create([
                    'journal_entry_id' => $je->id,
                    'account_id' => $expenseAcc->id,
                    'debit' => $payroll->net_payable,
                    'credit' => 0
                ]);

                // Credit Cash
                JournalItem::create([
                    'journal_entry_id' => $je->id,
                    'account_id' => $cashAcc->id,
                    'debit' => 0,
                    'credit' => $payroll->net_payable
                ]);
            }

            DB::commit();
            return $this->sendSuccess($payroll, 'Salary paid & Journal recorded');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }
}