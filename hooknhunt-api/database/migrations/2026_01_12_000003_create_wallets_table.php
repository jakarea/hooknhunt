<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Wallets table
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');

            $table->decimal('balance', 10, 2)->default(0.00);
            $table->decimal('total_credited', 12, 2)->default(0.00);
            $table->decimal('total_debited', 12, 2)->default(0.00);

            $table->boolean('is_active')->default(true);
            $table->boolean('is_frozen')->default(false)->comment('For fraud prevention');

            $table->timestamps();

            // Indexes
            $table->index('balance');
        });

        // Wallet Transactions table
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');

            // Transaction Type
            $table->enum('type', ['credit', 'debit'])->comment('credit: add money, debit: deduct money');
            $table->decimal('amount', 10, 2)->comment('Transaction amount (always positive)');
            $table->decimal('balance_before', 10, 2)->comment('Balance before this transaction');
            $table->decimal('balance_after', 10, 2)->comment('Balance after this transaction');

            // Transaction Details
            $table->enum('source_type', ['order', 'refund', 'adjustment', 'transfer', 'conversion', 'loyalty_redemption']);
            $table->BigInteger('source_id')->nullable()->comment('Reference to order_id, refund_id, etc.');
            $table->string('description')->comment('Transaction description');

            // Metadata
            $table->foreignId('created_by')->nullable()->comment('Admin user who made the adjustment');

            $table->timestamps();

            // Indexes
            $table->index(['wallet_id', 'type']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
    }
};
