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
     * 3. Balance Summary (Dashboard Widget)
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
}