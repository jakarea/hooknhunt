<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // প্রোডাক্ট এবং সাপ্লায়ারের সম্পর্ক (Pivot Table)
        Schema::create('product_supplier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
            
            $table->json('product_links')->nullable(); // 1688/Alibaba Link
            $table->string('supplier_sku')->nullable(); // Supplier এর কাছে এই প্রোডাক্টের কোড কি
            $table->decimal('cost_price', 10, 2)->nullable(); // এই সাপ্লায়ার কত দামে দেয়
            
            // একজন সাপ্লায়ার একবারই লিংক হবে একটা প্রোডাক্টের সাথে
            $table->unique(['product_id', 'supplier_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_supplier');
    }
};