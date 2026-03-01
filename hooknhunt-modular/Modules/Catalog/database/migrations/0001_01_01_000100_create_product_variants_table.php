<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create product_variants table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('product_id')->index(); // References products (Catalog module)
            $table->string('sku')->unique();
            $table->string('custom_sku')->nullable();
            $table->string('variant_name')->nullable();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('weight')->nullable();
            $table->string('pattern')->nullable();
            $table->unsignedBigInteger('unit_id')->nullable()->index(); // References units (System module)
            $table->decimal('unit_value', 8, 2)->default(1);
            $table->decimal('default_purchase_cost', 15, 2)->default(0);
            $table->decimal('default_retail_price', 15, 2)->default(0);
            $table->decimal('default_wholesale_price', 15, 2)->default(0);
            $table->integer('stock_alert_level')->default(5);
            $table->integer('wholesale_moq')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // Soft delete - no data loss

            // NO foreign keys - module independence
            // $table->foreign('product_id')->constrained('products')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('unit_id')->nullable()->constrained('units'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
