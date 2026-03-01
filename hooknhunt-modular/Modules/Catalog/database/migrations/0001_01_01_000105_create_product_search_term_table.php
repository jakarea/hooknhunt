<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create product_search_term table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('product_search_term', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('product_id')->index(); // References products (Catalog module)
            $table->unsignedBigInteger('search_term_id')->index(); // References search_terms (Catalog module)

            // NO foreign keys - module independence
            // $table->foreign('product_id')->constrained()->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('search_term_id')->constrained()->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_search_term');
    }
};
