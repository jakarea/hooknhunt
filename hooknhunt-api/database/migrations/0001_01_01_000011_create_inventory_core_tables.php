<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 26. Inventory Batches (FIFO Buckets)
        // প্রতিটি শিপমেন্ট বা প্রোডাকশনের পর এখানে নতুন রো ঢুকবে।
        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('restrict');
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->onDelete('restrict');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('batch_no')->index(); // e.g., Shipment Lot No
            
            // Costing (Fixed for this batch)
            $table->decimal('cost_price', 15, 2); // Landed Cost
            
            // Quantity Tracking
            $table->integer('initial_qty'); // শুরুতে কত ছিল
            $table->integer('remaining_qty'); // এখন কত আছে (Sales হলে কমবে)
            
            $table->date('manufacturing_date')->nullable();
            $table->date('expiry_date')->nullable();
            
            $table->timestamps();
            
            // FIFO Optimization Index: 
            // Query will be: WHERE variant_id = X AND remaining_qty > 0 ORDER BY created_at ASC
            $table->index(['product_variant_id', 'remaining_qty']); 
        });

        // 27. Stock Ledger (Audit Trail / History)
        // ইনভেন্টরির প্রতিটি নড়াচড়া (In/Out) এখানে রেকর্ড হবে।
        Schema::create('stock_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('restrict');
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->onDelete('restrict');
            $table->foreignId('inventory_batch_id')->nullable()->constrained('inventory_batches')->onDelete('cascade');
            
            $table->enum('type', [
                'purchase_in',      // মাল কেনা হলো
                'sale_out',         // মাল বিক্রি হলো
                'return_in',        // কাস্টমার ফেরত দিল
                'return_out',       // সাপ্লায়ারকে ফেরত দেওয়া হলো
                'transfer',         // এক ওয়ারহাউজ থেকে অন্য ওয়ারহাউজে
                'adjustment',       // ম্যানুয়ালি ঠিক করা (চুরি/নষ্ট)
                'opening_stock'     // সফটওয়্যার শুরুর সময়
            ]);
            
            $table->integer('qty_change'); // Positive (+) for IN, Negative (-) for OUT
            
            // Polymorphic Relation (কোন অর্ডার বা শিপমেন্টের কারণে স্টক চেঞ্জ হলো?)
            $table->nullableMorphs('reference'); // reference_type, reference_id
            
            $table->timestamp('date');
            $table->timestamps();
        });

        // 28. Inventory Adjustments (Manual Corrections)
        Schema::create('inventory_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('adjusted_by')->constrained('users');
            
            $table->string('reference_no')->nullable(); // e.g., ADJ-001
            $table->date('date');
            $table->text('reason')->nullable(); // e.g., "Found 2 pcs extra", "Rat damage"
            
            $table->timestamps();
        });

        // Adjustment Items (Adjustments টেবিলের ডিটেইলস)
        Schema::create('inventory_adjustment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adjustment_id')->constrained('inventory_adjustments')->onDelete('cascade');
            $table->foreignId('inventory_batch_id')->constrained('inventory_batches');
            
            $table->integer('qty'); // নেগেটিভ হলে কমানো, পজিটিভ হলে বাড়ানো
            $table->enum('type', ['damage', 'loss', 'found', 'correction']);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_adjustment_items');
        Schema::dropIfExists('inventory_adjustments');
        Schema::dropIfExists('stock_ledgers');
        Schema::dropIfExists('inventory_batches');
    }
};