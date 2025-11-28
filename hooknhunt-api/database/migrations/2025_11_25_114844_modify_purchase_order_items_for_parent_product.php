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
            // Add product_id column for parent product support
            $table->foreignId('product_id')->nullable()->after('id')->constrained('products')->onDelete('cascade');

            // Make product_variant_id nullable (will be filled during receiving stage)
            $table->dropForeign(['product_variant_id']);
            $table->foreignId('product_variant_id')->nullable()->change();
            $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            // Remove product_id column
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');

            // Make product_variant_id required again
            $table->dropForeign(['product_variant_id']);
            $table->foreignId('product_variant_id')->nullable(false)->change();
            $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
        });
    }
};
