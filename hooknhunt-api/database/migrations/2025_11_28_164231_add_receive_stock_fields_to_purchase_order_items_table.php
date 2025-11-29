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
        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Add fields for receiving stock at hub
            $table->decimal('unit_weight', 10, 2)->nullable()->after('quantity');
            $table->decimal('extra_weight', 10, 2)->nullable()->after('unit_weight');
            $table->integer('lost_quantity')->default(0)->after('extra_weight');

            // Remove old fields that are no longer used
            if (Schema::hasColumn('purchase_order_items', 'shipping_cost')) {
                $table->dropColumn('shipping_cost');
            }
            if (Schema::hasColumn('purchase_order_items', 'lost_item_price')) {
                $table->dropColumn('lost_item_price');
            }
            if (Schema::hasColumn('purchase_order_items', 'final_unit_cost')) {
                $table->dropColumn('final_unit_cost');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropColumn(['unit_weight', 'extra_weight', 'lost_quantity']);
        });
    }
};
