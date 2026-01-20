<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\ChartOfAccount;
use App\Models\JournalItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    use ApiResponse;

    /**
     * 1. List Accounts with Current Balance
     */
    public function index(Request $request)
    {
        // Fetch accounts with calculated balance
        $accounts = ChartOfAccount::where('is_active', 1)
            ->withSum(['journalItems as debit_total' => function($q) {
                $q->select(DB::raw('COALESCE(SUM(debit), 0)'));
            }], 'debit')
            ->withSum(['journalItems as credit_total' => function($q) {
                $q->select(DB::raw('COALESCE(SUM(credit), 0)'));
            }], 'credit')
            ->get()
            ->map(function($acc) {
                // Calculate Balance based on Account Type
                // Asset/Expense: Debit - Credit
                // Liability/Equity/Income: Credit - Debit
                if (in_array($acc->type, ['asset', 'expense'])) {
                    $acc->balance = $acc->debit_total - $acc->credit_total;
                } else {
                    $acc->balance = $acc->credit_total - $acc->debit_total;
                }
                return $acc;
            });

        return $this->sendSuccess($accounts);
    }

    /**
     * 2. Create New Ledger Account
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|unique:chart_of_accounts,code',
            'type' => 'required|in:asset,liability,equity,income,expense'
        ]);

        $account = ChartOfAccount::create($request->all());
        return $this->sendSuccess($account, 'Account Head created');
    }

    /**
     * 3. Get Single Account by ID
     * GET /api/v2/finance/accounts/{id}
     */
    public function show($id)
    {
        $account = ChartOfAccount::withSum(['journalItems as debit_total' => function($q) {
            $q->select(DB::raw('COALESCE(SUM(debit), 0)'));
        }], 'debit')
            ->withSum(['journalItems as credit_total' => function($q) {
            $q->select(DB::raw('COALESCE(SUM(credit), 0)'));
        }], 'credit')
            ->findOrFail($id);

        // Calculate balance based on account type
        if (in_array($account->type, ['asset', 'expense'])) {
            $account->balance = $account->debit_total - $account->credit_total;
        } else {
            $account->balance = $account->credit_total - $account->debit_total;
        }

        return $this->sendSuccess($account, 'Account retrieved successfully.');
    }

    /**
     * 4. Update Account
     * PUT/PATCH /api/v2/finance/accounts/{id}
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string',
            'code' => 'sometimes|required|unique:chart_of_accounts,code,' . $id,
            'type' => 'sometimes|required|in:asset,liability,equity,income,expense',
            'is_active' => 'sometimes|boolean',
            'description' => 'sometimes|nullable|string',
        ]);

        $account = ChartOfAccount::findOrFail($id);

        // Check if account has journal entries (transactions)
        $hasTransactions = $account->journalItems()->exists();
        if ($hasTransactions) {
            return $this->sendError('Cannot update account with existing journal entries. Create a new account instead.');
        }

        // Update the account
        $account->update($request->only([
            'name',
            'code',
            'type',
            'is_active',
            'description',
        ]));

        return $this->sendSuccess($account, 'Account updated successfully.');
    }

    /**
     * 5. Balance Summary (Dashboard Widget)
     */
    public function balanceSummary()
    {
        $summary = [
            'total_cash' => $this->getAccountBalance('Cash on Hand'), // Name needs to match DB
            'total_sales' => $this->getAccountBalance('Sales Revenue'),
            'total_expense' => $this->getAccountBalance('Expense', true) // true = by Type
        ];
        return $this->sendSuccess($summary);
    }

    // Helper
    private function getAccountBalance($identifier, $byType = false)
    {
        $query = JournalItem::whereHas('account', function($q) use ($identifier, $byType) {
            if ($byType) $q->where('type', $identifier);
            else $q->where('name', $identifier);
        });

        // Simple Debit - Credit for now (Refine logic per type later)
        return $query->sum(DB::raw('debit - credit'));
    }

    /**
     * 6. Delete Account
     * DELETE /api/v2/finance/accounts/{id}
     */
    public function destroy($id)
    {
        $account = ChartOfAccount::findOrFail($id);

        // Check if account has journal entries (transactions)
        $hasTransactions = $account->journalItems()->exists();
        if ($hasTransactions) {
            return $this->sendError('Cannot delete account with existing journal entries.');
        }

        // Check if account has expenses
        $hasExpenses = $account->expenses()->exists();
        if ($hasExpenses) {
            return $this->sendError('Cannot delete account with existing expenses.');
        }

        // Delete the account (safe to delete if no transactions)
        $account->delete();

        return $this->sendSuccess(null, 'Account deleted successfully.');
    }
}