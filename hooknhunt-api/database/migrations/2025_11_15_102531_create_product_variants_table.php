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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('sku')->unique();
            $table->decimal('landed_cost', 10, 2)->default(0);

            // Retail Channel Fields
            $table->string('retail_name');
            $table->decimal('retail_price', 10, 2)->default(0);
            $table->enum('retail_offer_discount_type', ['flat', 'percentage'])->nullable();
            $table->decimal('retail_offer_discount_value', 10, 2)->nullable();
            $table->timestamp('retail_offer_start_date')->nullable();
            $table->timestamp('retail_offer_end_date')->nullable();

            // Wholesale Channel Fields
            $table->string('wholesale_name');
            $table->decimal('wholesale_price', 10, 2)->default(0);
            $table->integer('moq_wholesale')->default(10);
            $table->enum('wholesale_offer_discount_type', ['flat', 'percentage'])->nullable();
            $table->decimal('wholesale_offer_discount_value', 10, 2)->nullable();
            $table->timestamp('wholesale_offer_start_date')->nullable();
            $table->timestamp('wholesale_offer_end_date')->nullable();

            // Daraz Channel Fields
            $table->string('daraz_name');
            $table->decimal('daraz_price', 10, 2)->default(0);
            $table->integer('moq_daraz')->default(1);
            $table->enum('daraz_offer_discount_type', ['flat', 'percentage'])->nullable();
            $table->decimal('daraz_offer_discount_value', 10, 2)->nullable();
            $table->timestamp('daraz_offer_start_date')->nullable();
            $table->timestamp('daraz_offer_end_date')->nullable();

            // Other Fields
            $table->string('variant_thumbnail_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};