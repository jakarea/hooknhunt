<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\JournalItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // <--- Carbon Import করুন

class ReportController extends Controller
{
    use ApiResponse;

    /**
     * 1. Profit & Loss Statement (Income - Expense)
     */
    public function profitLoss(Request $request)
    {
        // Date Fix: Ensure full day coverage
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date)->startOfDay() 
            : Carbon::now()->startOfMonth();
            
        $endDate = $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay() 
            : Carbon::now()->endOfDay();

        // Calculate Total Income (Credit balance of 'income' type accounts)
        $income = JournalItem::whereHas('account', fn($q) => $q->where('type', 'income'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum(DB::raw('credit - debit'));

        // Calculate Total Expense (Debit balance of 'expense' type accounts)
        $expense = JournalItem::whereHas('account', fn($q) => $q->where('type', 'expense'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum(DB::raw('debit - credit'));

        $netProfit = $income - $expense;

        return $this->sendSuccess([
            'date_range' => $startDate->format('Y-m-d') . " to " . $endDate->format('Y-m-d'),
            'total_income' => (float) $income,
            'total_expense' => (float) $expense,
            'net_profit' => (float) $netProfit,
            'status' => $netProfit >= 0 ? 'Profit' : 'Loss'
        ]);
    }
}