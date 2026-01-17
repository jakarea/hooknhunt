<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\BankTransaction;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class BankTransactionController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of all bank transactions.
     *
     * GET /api/v2/finance/bank-transactions
     */
    public function index(Request $request)
    {
        $query = BankTransaction::with(['bank', 'createdBy', 'journalEntry', 'transactionable']);

        // Filter by bank
        if ($request->has('bank_id')) {
            $query->where('bank_id', $request->bank_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        $transactions = $query->orderBy('transaction_date', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->paginate(100);

        return $this->sendSuccess($transactions, 'Bank transactions retrieved successfully.');
    }

    /**
     * Display the specified transaction.
     *
     * GET /api/v2/finance/bank-transactions/{id}
     */
    public function show($id)
    {
        $transaction = BankTransaction::with([
            'bank',
            'createdBy',
            'journalEntry',
            'journalEntry.items',
            'journalEntry.items.account',
            'transactionable'
        ])->findOrFail($id);

        return $this->sendSuccess($transaction, 'Transaction retrieved successfully.');
    }

    /**
     * Get transaction statistics.
     *
     * GET /api/v2/finance/bank-transactions/statistics
     */
    public function statistics(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'bank_id' => 'nullable|exists:banks,id',
        ]);

        $query = BankTransaction::query();

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        if ($request->has('bank_id')) {
            $query->where('bank_id', $request->bank_id);
        }

        $totalDeposits = (clone $query)->ofType('deposit')->sum('amount');
        $totalWithdrawals = (clone $query)->ofType('withdrawal')->sum('amount');
        $totalTransferIn = (clone $query)->ofType('transfer_in')->sum('amount');
        $totalTransferOut = (clone $query)->ofType('transfer_out')->sum('amount');

        $statistics = [
            'total_deposits' => $totalDeposits,
            'total_withdrawals' => $totalWithdrawals,
            'total_transfer_in' => $totalTransferIn,
            'total_transfer_out' => $totalTransferOut,
            'total_inflow' => $totalDeposits + $totalTransferIn,
            'total_outflow' => $totalWithdrawals + $totalTransferOut,
            'net_flow' => ($totalDeposits + $totalTransferIn) - ($totalWithdrawals + $totalTransferOut),
            'transaction_count' => $query->count(),
            'by_type' => [
                'deposit' => $totalDeposits,
                'withdrawal' => $totalWithdrawals,
                'transfer_in' => $totalTransferIn,
                'transfer_out' => $totalTransferOut,
            ],
        ];

        return $this->sendSuccess($statistics, 'Transaction statistics retrieved successfully.');
    }
}
