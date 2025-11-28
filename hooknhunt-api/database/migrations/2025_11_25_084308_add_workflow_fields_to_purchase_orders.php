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
        Schema::table('purchase_orders', function (Blueprint $table) {
            // Order identification - only add if they don't exist
            if (!Schema::hasColumn('purchase_orders', 'order_number')) {
                $table->string('order_number')->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('purchase_orders', 'exchange_rate')) {
                $table->decimal('exchange_rate', 10, 2)->nullable()->after('supplier_id');
            }

            // International shipping
            if (!Schema::hasColumn('purchase_orders', 'courier_name')) {
                $table->string('courier_name')->nullable()->after('exchange_rate');
            }
            if (!Schema::hasColumn('purchase_orders', 'tracking_number')) {
                $table->string('tracking_number')->nullable()->after('courier_name');
            }

            // Bangladesh shipping
            if (!Schema::hasColumn('purchase_orders', 'lot_number')) {
                $table->string('lot_number')->nullable()->after('tracking_number');
            }
            if (!Schema::hasColumn('purchase_orders', 'total_weight')) {
                $table->decimal('total_weight', 10, 2)->nullable()->after('lot_number');
            }
            if (!Schema::hasColumn('purchase_orders', 'extra_cost_global')) {
                $table->decimal('extra_cost_global', 10, 2)->nullable()->after('total_weight');
            }
            if (!Schema::hasColumn('purchase_orders', 'bd_courier_tracking')) {
                $table->string('bd_courier_tracking')->nullable()->after('extra_cost_global');
            }
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Per-item costs - only add if they don't exist
            if (!Schema::hasColumn('purchase_order_items', 'lost_quantity')) {
                $table->integer('lost_quantity')->default(0)->after('quantity');
            }
            if (!Schema::hasColumn('purchase_order_items', 'lost_item_price')) {
                $table->decimal('lost_item_price', 10, 2)->default(0)->after('lost_quantity');
            }
            if (!Schema::hasColumn('purchase_order_items', 'final_unit_cost')) {
                $table->decimal('final_unit_cost', 10, 2)->nullable()->after('lost_item_price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            // Only drop columns that exist
            $columnsToDrop = [];
            if (Schema::hasColumn('purchase_orders', 'order_number')) {
                $columnsToDrop[] = 'order_number';
            }
            if (Schema::hasColumn('purchase_orders', 'exchange_rate')) {
                $columnsToDrop[] = 'exchange_rate';
            }
            if (Schema::hasColumn('purchase_orders', 'courier_name')) {
                $columnsToDrop[] = 'courier_name';
            }
            if (Schema::hasColumn('purchase_orders', 'tracking_number')) {
                $columnsToDrop[] = 'tracking_number';
            }
            if (Schema::hasColumn('purchase_orders', 'lot_number')) {
                $columnsToDrop[] = 'lot_number';
            }
            if (Schema::hasColumn('purchase_orders', 'total_weight')) {
                $columnsToDrop[] = 'total_weight';
            }
            if (Schema::hasColumn('purchase_orders', 'extra_cost_global')) {
                $columnsToDrop[] = 'extra_cost_global';
            }
            if (Schema::hasColumn('purchase_orders', 'bd_courier_tracking')) {
                $columnsToDrop[] = 'bd_courier_tracking';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Only drop columns that exist
            $columnsToDrop = [];
            if (Schema::hasColumn('purchase_order_items', 'lost_quantity')) {
                $columnsToDrop[] = 'lost_quantity';
            }
            if (Schema::hasColumn('purchase_order_items', 'lost_item_price')) {
                $columnsToDrop[] = 'lost_item_price';
            }
            if (Schema::hasColumn('purchase_order_items', 'final_unit_cost')) {
                $columnsToDrop[] = 'final_unit_cost';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
