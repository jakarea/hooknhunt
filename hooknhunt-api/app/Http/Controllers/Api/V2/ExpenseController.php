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
            'expense_date' => 'required|date',
            // VAT and Tax fields - optional
            'vat_percentage' => 'nullable|numeric|min:0|max:100',
            'vat_amount' => 'nullable|numeric|min:0',
            'vat_challan_no' => 'nullable|string|max:255',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'tax_amount' => 'nullable|numeric|min:0',
            'tax_challan_no' => 'nullable|string|max:255',
        ]);

        $expense = Expense::create([
            'title' => $request->title,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'account_id' => $request->account_id,
            'paid_by' => auth()->id(),
            'is_approved' => false,
            // VAT and Tax fields
            'vat_percentage' => $request->vat_percentage,
            'vat_amount' => $request->vat_amount,
            'vat_challan_no' => $request->vat_challan_no,
            'tax_percentage' => $request->tax_percentage,
            'tax_amount' => $request->tax_amount,
            'tax_challan_no' => $request->tax_challan_no,
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
            // VAT and Tax fields - optional
            'vat_percentage' => 'nullable|numeric|min:0|max:100',
            'vat_amount' => 'nullable|numeric|min:0',
            'vat_challan_no' => 'nullable|string|max:255',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'tax_amount' => 'nullable|numeric|min:0',
            'tax_challan_no' => 'nullable|string|max:255',
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
            // VAT and Tax fields
            'vat_percentage',
            'vat_amount',
            'vat_challan_no',
            'tax_percentage',
            'tax_amount',
            'tax_challan_no',
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
            // Try multiple patterns to find a cash/bank account
            $cashAccount = ChartOfAccount::where('type', 'asset')
                ->where(function ($query) {
                    $query->where('name', 'like', '%Cash%')
                          ->orWhere('name', 'like', '%cash%')
                          ->orWhere('name', 'Cash on Hand')
                          ->orWhere('name', 'Petty Cash')
                          ->orWhere('name', 'like', '%Bank%')
                          ->orWhere('name', 'like', '%bank%')
                          ->orWhere('name', 'like', '%bKash%')
                          ->orWhere('code', 'like', 'BANK%');
                })
                ->where('is_active', true)
                ->first();

            // If no cash account found, throw error instead of using unsafe default
            if (!$cashAccount) {
                DB::rollBack();
                return $this->sendError(
                    'Payment account not configured. Please create a Cash or Bank account (Asset type) with "Cash" or "Bank" in the name.',
                    null,
                    400
                );
            }

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
                'account_id' => $cashAccount->id,
                'debit' => 0,
                'credit' => $expense->amount
            ]);

            // D. Validate balance (critical for double-entry)
            if (!$je->isBalanced()) {
                DB::rollBack();
                return $this->sendError(
                    'Journal entry is not balanced. Debit: ' . $je->getTotalDebitAttribute . ', Credit: ' . $je->getTotalCreditAttribute,
                    null,
                    500
                );
            }

            DB::commit();
            return $this->sendSuccess(null, 'Expense approved and posted to Ledger.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Approval failed', ['error' => $e->getMessage()]);
        }
    }
}