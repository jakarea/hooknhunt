<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchNineSeeder extends Seeder
{
    public function run(): void
    {
        $admin = DB::table('users')->first();

        // 1. Expense Entry (Office Rent)
        // Step A: Create Expense Record
        $rentAccountId = DB::table('chart_of_accounts')->where('code', '5002')->value('id'); // Rent
        $cashAccountId = DB::table('chart_of_accounts')->where('code', '1001')->value('id'); // Cash
        
        $expenseId = DB::table('expenses')->insertGetId([
            'title' => 'Office Rent - Jan 2025',
            'amount' => 5000.00,
            'expense_date' => now(),
            'account_id' => $rentAccountId,
            'paid_by' => $admin->id,
            'is_approved' => true,
            'created_at' => now(),
        ]);

        // Step B: Create Journal Entry (Accounting Effect)
        $journalId = DB::table('journal_entries')->insertGetId([
            'entry_number' => 'JE-' . time(),
            'date' => now(),
            'description' => 'Office Rent Payment',
            'reference_type' => 'App\Models\Expense',
            'reference_id' => $expenseId,
            'created_by' => $admin->id,
            'created_at' => now(),
        ]);

        // Step C: Journal Items (Debit Expense, Credit Cash)
        DB::table('journal_items')->insert([
            [
                'journal_entry_id' => $journalId,
                'account_id' => $rentAccountId, // Debit Rent (Expense increases)
                'debit' => 5000.00,
                'credit' => 0.00,
                'created_at' => now(),
            ],
            [
                'journal_entry_id' => $journalId,
                'account_id' => $cashAccountId, // Credit Cash (Asset decreases)
                'debit' => 0.00,
                'credit' => 5000.00,
                'created_at' => now(),
            ]
        ]);

        // 2. Customer Payment Record
        $order = DB::table('sales_orders')->first();
        if ($order) {
            DB::table('payments')->insert([
                'sales_order_id' => $order->id,
                'customer_id' => $order->customer_id,
                'method' => 'bkash',
                'transaction_id' => 'TRX987654321',
                'amount' => 1000.00,
                'status' => 'approved',
                'created_at' => now(),
            ]);
        }
    }
}