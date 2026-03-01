<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create product_supplier table (Procurement Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('product_supplier', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('product_id')->index(); // References products (Catalog module)
            $table->unsignedBigInteger('supplier_id')->index(); // References suppliers (User module)

            $table->json('product_links')->nullable();
            $table->string('supplier_sku')->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->unique(['product_id', 'supplier_id']);
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('product_id')->constrained('products')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('supplier_id')->constrained('suppliers')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_supplier');
    }
};
