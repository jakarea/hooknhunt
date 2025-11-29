<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->nullable()->nullable();
            
            // Foreign key to suppliers table (assuming it exists)
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->decimal('exchange_rate', 10, 2)->nullable();
            $table->date('order_date')->nullable();
            $table->date('expected_date')->nullable();
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('status')->default('pending'); // pending, approved, received
            $table->string('courier_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('lot_number')->nullable();
            $table->enum('shipping_method', ['air', 'sea'])->nullable();
            $table->decimal('shipping_cost', 10, 2)->nullable();
            $table->string('bd_courier_tracking')->nullable();
            $table->decimal('total_weight', 10, 2)->nullable();
            $table->decimal('extra_cost_global', 10, 2)->nullable();
            $table->timestamps();

            // FK
            $table->foreign('supplier_id')
                  ->references('id')
                  ->on('suppliers')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
