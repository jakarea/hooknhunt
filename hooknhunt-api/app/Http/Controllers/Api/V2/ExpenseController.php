<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\JournalEntry;
use App\Models\JournalItem;
use App\Models\ChartOfAccount;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    use ApiResponse;

    /**
     * 1. Create Expense Request
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'account_id' => 'required|exists:chart_of_accounts,id', // Expense Head
            'expense_date' => 'required|date'
        ]);

        $expense = Expense::create([
            'title' => $request->title,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'account_id' => $request->account_id,
            'paid_by' => auth()->id(),
            'is_approved' => false
        ]);

        return $this->sendSuccess($expense, 'Expense submitted for approval.');
    }

    /**
     * 2. List All Expenses (with filters)
     * GET /api/v2/finance/expenses
     */
    public function index(Request $request)
    {
        $query = Expense::with(['account', 'user']);

        // Filter by account
        if ($request->has('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        // Filter by approval status
        if ($request->has('is_approved')) {
            $query->where('is_approved', $request->boolean('is_approved'));
        }

        // Filter by user who paid
        if ($request->has('paid_by')) {
            $query->where('paid_by', $request->paid_by);
        }

        // Search by title, reference_number, or notes
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('expense_date', [$request->start_date, $request->end_date]);
        }

        // Order by latest first
        $expenses = $query->orderBy('expense_date', 'desc')
                       ->orderBy('created_at', 'desc')
                       ->paginate($request->per_page ?? 15);

        return $this->sendSuccess($expenses, 'Expenses retrieved successfully.');
    }

    /**
     * 3. Get Single Expense by ID
     * GET /api/v2/finance/expenses/{id}
     */
    public function show($id)
    {
        $expense = Expense::with(['account', 'user'])->findOrFail($id);
        return $this->sendSuccess($expense, 'Expense retrieved successfully.');
    }

    /**
     * 4. Update Expense
     * PUT/PATCH /api/v2/finance/expenses/{id}
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string',
            'amount' => 'sometimes|numeric|min:1',
            'account_id' => 'sometimes|exists:chart_of_accounts,id',
            'expense_date' => 'sometimes|date',
            'reference_number' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
            'attachment' => 'sometimes|nullable|string',
        ]);

        $expense = Expense::findOrFail($id);

        // Prevent modification if already approved (journal entries already posted)
        if ($expense->is_approved) {
            return $this->sendError('Cannot modify approved expenses. Ledger entries already posted.');
        }

        // Update only provided fields
        $expense->update($request->only([
            'title',
            'amount',
            'account_id',
            'expense_date',
            'reference_number',
            'notes',
            'attachment',
        ]));

        return $this->sendSuccess($expense->load(['account', 'user']), 'Expense updated successfully.');
    }

    /**
     * 5. Delete Expense
     * DELETE /api/v2/finance/expenses/{id}
     */
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);

        // Prevent deletion if already approved (protects ledger entries)
        if ($expense->is_approved) {
            return $this->sendError('Cannot delete approved expenses. Ledger entries already posted.');
        }

        // Delete the expense (only if not approved)
        $expense->delete();

        return $this->sendSuccess(null, 'Expense deleted successfully.');
    }

    /**
     * 6. Approve Expense & Post to Journal
     */
    public function approve(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        
        if ($expense->is_approved) {
            return $this->sendError('Already approved');
        }

        DB::beginTransaction();
        try {
            // A. Mark as Approved
            $expense->update(['is_approved' => true]);

            // B. Find "Cash" or "Bank" Account for Credit
            // (Assuming ID 1 is Cash, needs dynamic setting in real app)
            $cashAccount = ChartOfAccount::where('name', 'Cash on Hand')->first(); 

            // C. Create Journal Entry (Double Entry)
            $je = JournalEntry::create([
                'entry_number' => 'EXP-' . time(),
                'date' => $expense->expense_date,
                'description' => $expense->title,
                'reference_type' => Expense::class,
                'reference_id' => $expense->id,
                'created_by' => auth()->id()
            ]);

            // Debit: Expense Account
            JournalItem::create([
                'journal_entry_id' => $je->id,
                'account_id' => $expense->account_id,
                'debit' => $expense->amount,
                'credit' => 0
            ]);

            // Credit: Cash Account
            JournalItem::create([
                'journal_entry_id' => $je->id,
                'account_id' => $cashAccount->id ?? 1,
                'debit' => 0,
                'credit' => $expense->amount
            ]);

            DB::commit();
            return $this->sendSuccess(null, 'Expense approved and posted to Ledger.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Approval failed', ['error' => $e->getMessage()]);
        }
    }
}