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
        Schema::table('product_supplier', function (Blueprint $table) {
            // Drop the existing single URL column
            $table->dropColumn('supplier_product_url');

            // Add the new JSON column for multiple URLs
            $table->json('supplier_product_urls')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_supplier', function (Blueprint $table) {
            // Drop the JSON column
            $table->dropColumn('supplier_product_urls');

            // Restore the original string column
            $table->string('supplier_product_url')->nullable();
        });
    }
};
