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
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.payroll.index')) {
            return $this->sendError('You do not have permission to view payroll.', null, 403);
        }

        $query = Payroll::with(['user:id,name', 'user.staffProfile:user_id,designation,department_id', 'user.staffProfile.department']);

        $user = auth()->user();

        // Check if user is admin
        $isAdmin = false;
        if ($user->role) {
            $isAdmin = in_array($user->role->slug, ['super_admin', 'admin']);
        }
        if (!$isAdmin) {
            $isAdmin = in_array($user->role_id, [8, 1, 2]);
        }

        // Admin can filter by specific user
        if ($request->has('user_id') && $isAdmin) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->month_year) {
            $query->where('month_year', $request->month_year);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Staff can only see their own (unless admin already filtered by user_id above)
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        return $this->sendSuccess($query->paginate(20));
    }

    /**
     * 2. Generate Salary Sheet for a Month (Admin Only)
     * Rule: 1 staff can have only 1 payroll record per month
     */
    public function generate(Request $request)
    {
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.payroll.generate')) {
            return $this->sendError('You do not have permission to generate payroll.', null, 403);
        }

        $request->validate([
            'month_year' => 'required|date_format:Y-m', // e.g. "2025-01"
        ]);

        $month = $request->month_year;

        // Get All Active Staff (Excluding Customers)
        $staffs = User::with('staffProfile')
            ->whereHas('role', fn($q) => $q->whereNotIn('id', [10, 11])) // Exclude customer roles
            ->where('is_active', true)
            ->get();

        if ($staffs->isEmpty()) {
            return $this->sendError('No active staff found to generate payroll.');
        }

        DB::beginTransaction();
        try {
            $count = 0;
            $skipped = 0;

            foreach ($staffs as $staff) {
                // Skip if no staff profile or salary set
                $baseSalary = $staff->staffProfile->base_salary ?? 0;
                if ($baseSalary <= 0) {
                    $skipped++;
                    continue;
                }

                // Skip if this staff already has payroll for this month (1 staff = 1 time per month)
                if (Payroll::where('user_id', $staff->id)->where('month_year', $month)->exists()) {
                    $skipped++;
                    continue;
                }

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

            $message = "Payroll generated for {$count} employees for month {$month}";
            if ($skipped > 0) {
                $message .= " ({$skipped} skipped - already have payroll or no salary)";
            }

            return $this->sendSuccess(null, $message);

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
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.payroll.edit')) {
            return $this->sendError('You do not have permission to edit payroll.', null, 403);
        }

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
        // Permission check
        if (!auth()->user()->hasPermissionTo('hrm.payroll.process')) {
            return $this->sendError('You do not have permission to process payroll payments.', null, 403);
        }

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