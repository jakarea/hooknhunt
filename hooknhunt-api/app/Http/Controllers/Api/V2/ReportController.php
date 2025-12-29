<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\JournalItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    use ApiResponse;

    /**
     * 1. Profit & Loss Statement (Income - Expense)
     */
    public function profitLoss(Request $request)
    {
        $startDate = $request->start_date ?? date('Y-m-01');
        $endDate = $request->end_date ?? date('Y-m-d');

        // Calculate Total Income (Credit balance of 'income' type accounts)
        $income = JournalItem::whereHas('account', fn($q) => $q->where('type', 'income'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum(DB::raw('credit - debit'));

        // Calculate Total Expense (Debit balance of 'expense' type accounts)
        // Also include COGS (Cost of Goods Sold)
        $expense = JournalItem::whereHas('account', fn($q) => $q->where('type', 'expense'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum(DB::raw('debit - credit'));

        $netProfit = $income - $expense;

        return $this->sendSuccess([
            'date_range' => "$startDate to $endDate",
            'total_income' => $income,
            'total_expense' => $expense,
            'net_profit' => $netProfit,
            'status' => $netProfit >= 0 ? 'Profit' : 'Loss'
        ]);
    }
}