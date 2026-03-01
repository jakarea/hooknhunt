<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create attribute_options table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('attribute_options', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('attribute_id')->index(); // References attributes (Catalog module)

            $table->string('value')->nullable(); // e.g., 'red', '2-years', 'china'
            $table->string('label')->nullable(); // e.g., 'Red', '2 Years', 'China'
            $table->string('swatch_value')->nullable(); // Hex code for color or image URL
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('attribute_id')->constrained('attributes')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_options');
    }
};
