<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create purchase_orders and purchase_order_items tables (Procurement Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        // Create purchase_orders table
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->nullable()->unique(); // Format: PO-202511-15

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('supplier_id')->nullable()->index(); // References suppliers (User module)
            $table->unsignedBigInteger('payment_account_id')->nullable()->index(); // References banks (Finance module)
            $table->unsignedBigInteger('journal_entry_id')->nullable()->index(); // References journal_entries (Finance module)
            $table->unsignedBigInteger('created_by')->nullable()->index(); // References users (Auth module)

            $table->decimal('exchange_rate', 10, 2)->nullable(); // CNY to BDT exchange rate
            $table->date('order_date'); // Order creation date
            $table->date('expected_date')->nullable(); // Expected delivery date
            $table->decimal('total_amount', 15, 2)->default(0); // Total amount in RMB

            // Refund fields (added 2026-02-19)
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->string('credit_note_number')->nullable();
            $table->boolean('refund_auto_credited')->default(false);
            $table->timestamp('refunded_at')->nullable();
            $table->text('receiving_notes')->nullable();

            // Status with partially_completed option (added 2026-02-21)
            $table->enum('status', [
                'draft',
                'payment_confirmed',
                'supplier_dispatched',
                'warehouse_received',
                'shipped_bd',
                'arrived_bd',
                'in_transit_bogura',
                'received_hub',
                'partially_completed',
                'completed',
                'lost'
            ])->default('draft');

            // Payment fields (added 2026-02-22)
            $table->decimal('payment_amount', 10, 2)->nullable(); // Total payment in BDT
            $table->decimal('supplier_credit_used', 10, 2)->default(0); // From supplier credit
            $table->decimal('bank_payment_amount', 10, 2)->nullable(); // From bank

            // Tracking fields
            $table->string('courier_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('lot_number')->nullable();

            // Shipping fields
            $table->string('shipping_method')->nullable();
            $table->decimal('total_shipping_cost', 10, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->nullable()->default(0);
            $table->decimal('total_weight', 10, 2)->nullable();
            $table->decimal('extra_cost_global', 15, 2)->nullable()->default(0);
            $table->string('bd_courier_tracking')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('po_number');
            $table->index('status');
            $table->index('order_date');

            // NO foreign keys - module independence
            // $table->foreign('supplier_id')->constrained('suppliers')->onDelete('restrict'); // ❌ REMOVED
            // $table->foreign('payment_account_id')->constrained('banks')->nullOnDelete(); // ❌ REMOVED
            // $table->foreign('journal_entry_id')->constrained('journal_entries')->nullOnDelete(); // ❌ REMOVED
            // $table->foreign('created_by')->constrained('users')->onDelete('set null'); // ❌ REMOVED
        });

        // Create purchase_order_items table
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->string('po_number'); // Reference to purchase_orders.po_number

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('product_id')->nullable()->index(); // References products (Catalog module)
            $table->unsignedBigInteger('product_variant_id')->nullable()->index(); // References product_variants (Catalog module)
            $table->unsignedBigInteger('inventory_batch_id')->nullable()->index(); // References inventory_batches (Inventory module)

            // Price fields
            $table->decimal('china_price', 10, 2)->default(0); // Unit price in RMB
            $table->integer('quantity')->default(0); // Ordered quantity
            $table->decimal('bd_price', 10, 2)->nullable(); // Unit price in BDT
            $table->decimal('total_price', 10, 2)->default(0); // china_price * quantity

            // Weight fields
            $table->decimal('unit_weight', 10, 2)->nullable(); // Weight per unit in kg
            $table->decimal('extra_weight', 10, 2)->default(0); // Extra weight for packaging

            // Quantity tracking (defaults added)
            $table->integer('received_quantity')->default(0);
            $table->integer('stocked_quantity')->default(0);
            $table->integer('lost_quantity')->default(0);
            $table->decimal('lost_item_price', 10, 2)->default(0);

            // Cost tracking
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('shipping_cost_per_kg', 10, 2)->nullable();
            $table->decimal('final_unit_cost', 10, 2)->nullable();

            $table->timestamps();

            // Indexes
            $table->index('po_number');
            $table->index('product_id');

            // NO foreign key - module independence
            // $table->foreign('po_number')->references('po_number')->on('purchase_orders')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('product_id')->constrained('products')->onDelete('restrict'); // ❌ REMOVED
            // $table->foreign('product_variant_id')->constrained('product_variants')->onDelete('set null'); // ❌ REMOVED
            // $table->foreign('inventory_batch_id')->constrained('inventory_batches')->onDelete('set null'); // ❌ REMOVED
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
    }
};
