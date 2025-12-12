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
        Schema::table('inventory', function (Blueprint $table) {
            // Reserved quantity (items in cart/pending orders)
            $table->integer('reserved_quantity')->default(0)->after('quantity');

            // Available quantity (quantity - reserved_quantity)
            // This is calculated on-the-fly but we can add a virtual column or compute it in queries

            // Min/Max stock levels for alerts
            $table->integer('min_stock_level')->nullable()->after('reserved_quantity');
            $table->integer('max_stock_level')->nullable()->after('min_stock_level');

            // Reorder point (when to trigger purchase alert)
            $table->integer('reorder_point')->nullable()->after('max_stock_level');

            // Average cost tracking (for FIFO/AVCO inventory valuation)
            $table->decimal('average_unit_cost', 10, 2)->nullable()->after('reorder_point');

            // Last cost (from most recent purchase)
            $table->decimal('last_unit_cost', 10, 2)->nullable()->after('average_unit_cost');

            // Stock valuation (total value of inventory: quantity * average_unit_cost)
            $table->decimal('total_value', 12, 2)->default(0)->after('last_unit_cost');

            // Location tracking (warehouse/shelf location)
            $table->string('location', 100)->nullable()->after('total_value');

            // Timestamps for auditing
            $table->timestamp('last_stocked_at')->nullable()->after('location');
            $table->timestamp('last_sold_at')->nullable()->after('last_stocked_at');

            // Tracking fields
            $table->timestamps();

            // Add indexes for common queries
            $table->index(['quantity', 'reserved_quantity']);
            $table->index('min_stock_level');
            $table->index('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex(['quantity', 'reserved_quantity']);
            $table->dropIndex(['min_stock_level']);
            $table->dropIndex(['location']);

            // Drop columns
            $table->dropColumn([
                'reserved_quantity',
                'min_stock_level',
                'max_stock_level',
                'reorder_point',
                'average_unit_cost',
                'last_unit_cost',
                'total_value',
                'location',
                'last_stocked_at',
                'last_sold_at',
                'created_at',
                'updated_at'
            ]);
        });
    }
};
