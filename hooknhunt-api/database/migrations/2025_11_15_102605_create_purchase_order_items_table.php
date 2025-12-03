<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('po_number');
            $table->unsignedBigInteger('product_id')->nullable();

            $table->integer('quantity')->default(1);
            $table->decimal('china_price', 10, 2)->default(0);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);
            $table->decimal('final_unit_cost', 10, 2)->default(0);
            $table->unsignedBigInteger('product_variant_id')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('po_number')
                  ->references('id')
                  ->on('purchase_orders')
                  ->cascadeOnDelete();

            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
