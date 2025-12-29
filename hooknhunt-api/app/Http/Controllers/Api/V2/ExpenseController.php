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
     * 2. Approve Expense & Post to Journal
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