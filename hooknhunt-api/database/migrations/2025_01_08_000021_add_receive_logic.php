<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Supplier Wallet / Ledger (টাকা ফেরত বা এডভান্স রাখার জন্য)
      
            Schema::create('supplier_ledgers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
                $table->string('type'); // 'refund', 'payment', 'purchase', 'adjustment'
                $table->decimal('amount', 15, 2); // RMB Amount (+ or -)
                $table->decimal('balance', 15, 2)->default(0); // Running Balance
                $table->string('transaction_id')->nullable(); // For tracing
                $table->string('reason')->nullable(); // e.g., "Shortage Refund for LOT-2025"
                $table->timestamps();
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_ledgers');
    }
};