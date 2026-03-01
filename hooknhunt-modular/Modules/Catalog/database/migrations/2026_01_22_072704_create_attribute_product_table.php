<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create attribute_product pivot table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('attribute_product', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('product_id')->index(); // References products (Catalog module)
            $table->unsignedBigInteger('attribute_id')->index(); // References attributes (Catalog module)

            $table->text('value')->nullable(); // For text/number/date/boolean type attributes
            $table->json('option_ids')->nullable(); // For select/multiselect type attributes (array of option IDs)
            $table->timestamps();

            // Prevent duplicate attribute-product combinations
            $table->unique(['product_id', 'attribute_id']);

            // NO foreign keys - module independence
            // $table->foreign('product_id')->constrained('products')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('attribute_id')->constrained('attributes')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_product');
    }
};
