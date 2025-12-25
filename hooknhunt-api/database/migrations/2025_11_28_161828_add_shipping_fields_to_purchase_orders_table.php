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
            // Add shipping method and cost fields only if they don't exist
            if (!Schema::hasColumn('purchase_orders', 'shipping_method')) {
                $table->enum('shipping_method', ['air', 'sea'])->nullable()->after('lot_number');
            }
            if (!Schema::hasColumn('purchase_orders', 'shipping_cost')) {
                $table->decimal('shipping_cost', 10, 2)->nullable()->after('shipping_method');
            }

            // Add total_weight and extra_cost_global if they don't exist
            if (!Schema::hasColumn('purchase_orders', 'total_weight')) {
                $table->decimal('total_weight', 10, 2)->nullable()->after('bd_courier_tracking');
            }
            if (!Schema::hasColumn('purchase_orders', 'extra_cost_global')) {
                $table->decimal('extra_cost_global', 10, 2)->nullable()->after('total_weight');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_method', 'shipping_cost']);
            // Note: We don't drop total_weight and extra_cost_global as they might have been added by another migration
        });
    }
};
