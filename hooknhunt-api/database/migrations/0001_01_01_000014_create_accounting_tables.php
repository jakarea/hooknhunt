<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 37. Journal Entries (The Master Transaction Record)
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->string('entry_number')->unique(); // e.g., JE-2025-001
            $table->date('date');
            $table->text('description')->nullable();
            
            // Polymorphic Relation (কোন সেল, পারচেজ বা খরচের কারণে এই এন্ট্রি?)
            $table->nullableMorphs('reference'); // reference_type, reference_id
            
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // 38. Journal Items (Debit/Credit Lines)
        Schema::create('journal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_entry_id')->constrained('journal_entries')->onDelete('cascade');
            
            // Link to Chart of Accounts (From Batch 1)
            $table->foreignId('account_id')->constrained('chart_of_accounts')->onDelete('restrict');
            
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
            
            $table->timestamps();
        });

        // 39. Payments (Gateway/Cash Logs)
        // এটি সরাসরি সেলস অর্ডারের সাথে লিঙ্কড থাকবে।
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('sales_order_id')
                ->nullable()
                ->constrained('sales_orders')
                ->nullOnDelete();

            $table->foreignId('customer_id')
                ->nullable()
                ->constrained('customers')
                ->nullOnDelete();

            // Payment method
            $table->enum('method', [
                'cash',
                'bank_transfer',
                'bkash',
                'nagad',
                'card',
                'cheque'
            ])->default('cash');

            // Transaction info (mobile / bank)
            $table->string('transaction_id')->nullable();

            // Amount
            $table->decimal('amount', 12, 2);

            // Main payment status (admin approval)
            $table->enum('status', [
                'pending',
                'approved',
                'declined'
            ])->default('pending');

            // Cheque details (only if method = cheque)
            $table->string('bank_name')->nullable();
            $table->string('cheque_no')->nullable();
            $table->date('cheque_date')->nullable(); // maturity date
            $table->date('clearing_date')->nullable();

            // Cheque clearing status
            $table->enum('cheque_status', [
                'pending',
                'cleared',
                'bounced'
            ])->nullable();

            // Admin approval
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Notes
            $table->text('note')->nullable();

            $table->timestamps();
        });
    

        // 40. Expenses (Operational Cost)
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "Office Rent January"
            $table->decimal('amount', 12, 2);
            $table->date('expense_date');
            
            // Link to Expense Account (e.g., Rent, Utility)
            $table->foreignId('account_id')->constrained('chart_of_accounts');
            
            $table->foreignId('paid_by')->constrained('users'); // Who paid?
            $table->string('attachment')->nullable(); // Money receipt image
            
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });

        // 41. Payrolls (Staff Salary)
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Employee
            
            $table->string('month_year'); // e.g., "January 2025"
            $table->decimal('basic_salary', 12, 2);
            $table->decimal('bonus', 10, 2)->default(0);
            $table->decimal('deductions', 10, 2)->default(0);
            $table->decimal('net_payable', 12, 2);
            
            $table->enum('status', ['generated', 'paid'])->default('generated');
            $table->date('payment_date')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('journal_items');
        Schema::dropIfExists('journal_entries');
    }
};