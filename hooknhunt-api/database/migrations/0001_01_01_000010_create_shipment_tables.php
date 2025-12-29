<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use phpDocumentor\Reflection\Types\Nullable;

return new class extends Migration
{
    public function up(): void
    {
        // 22. Shipments (Master Table for Import Trip)
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('restrict');
            
            
            $table->string('po_number')->nullable()->unique(); // e.g., LOT-2025-001
            $table->string('lot_number')->nullable(); // e.g., LOT-2025-001
            
            // Workflow Status
            $table->enum('status', [
                'draft', 
                'payment_confirmed', 
                'shipped_from_china', 
                'warehouse_china', 
                'shipped_to_bd', 
                'customs_clearing', 
                'received_bogura', 
                'completed'
            ])->default('draft');

            // Financials
            $table->decimal('exchange_rate', 10, 4)->default(1); // RMB to BDT
            $table->decimal('total_china_cost_rmb', 15, 2)->default(0); // Total Product Cost
            
            // Shipping & Logistics
            $table->decimal('total_weight_actual', 10, 2)->nullable(); // kg
            $table->decimal('total_weight_chargeable', 10, 2)->nullable(); // kg
            
            // Cost Heads (For Landed Cost Calculation)
            $table->decimal('shipping_cost_intl', 15, 2)->default(0); // Air/Sea Charge
            $table->decimal('shipping_cost_local', 15, 2)->default(0); // Courier in BD
            $table->decimal('misc_cost', 15, 2)->default(0); // Customs/Bribes/Packing
            
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 23. Shipment Items (Products inside the shipment)
        Schema::create('shipment_items', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('shipment_id')
                ->constrained('shipments')
                ->onDelete('cascade');

            // Variant may be unknown at order time
            $table->foreignId('product_variant_id')
                ->nullable()
                ->constrained('product_variants')
                ->onDelete('restrict');

            // Generic product support (before variant sorting)
            $table->foreignId('product_id')
                ->nullable()
                ->constrained('products')
                ->nullOnDelete();

            // Quantities
            $table->integer('ordered_qty');
            $table->integer('received_qty')->default(0);
            $table->integer('lost_qty')->default(0); // Lost in transit

            // Flags
            $table->boolean('is_sorted')->default(false); // Variant assigned or not
            $table->boolean('is_lost')->default(false);   // Fully lost item

            // Pricing (China side)
            $table->decimal('unit_price_rmb', 10, 2); // Purchase price in RMB

            // Shipping & adjustment costs (assigned later)
            $table->decimal('shipping_cost_actual', 10, 2)->default(0);
            $table->decimal('extra_weight_charge', 10, 2)->default(0);

            // Final calculated landed cost
            // (unit_price * rate) + shipping share + loss adjustment
            $table->decimal('calculated_landed_cost', 15, 2)->nullable();

            $table->timestamps();
        });


        // 24. Shipment Costs (Breakdown of extra costs)
        Schema::create('shipment_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->string('cost_head'); // e.g., "C&F Agent Fee", "Van Rent"
            $table->decimal('amount', 15, 2);
            $table->foreignId('paid_by_user_id')->nullable()->constrained('users');
            $table->timestamps();
        });

        // 25. Shipment Timeline (Audit Log for Tracking)
        Schema::create('shipment_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->string('status_label'); // e.g., "Arrived in Dhaka Airport"
            $table->text('description')->nullable(); // e.g., "Tracking ID: XYZ123"
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamp('happened_at'); // Actual time of event
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_timelines');
        Schema::dropIfExists('shipment_costs');
        Schema::dropIfExists('shipment_items');
        Schema::dropIfExists('shipments');
    }
};