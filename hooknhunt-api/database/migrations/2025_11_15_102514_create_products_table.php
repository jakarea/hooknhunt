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
    Schema::create('products', function (Blueprint $table) {
        $table->id();

        // Basic Product Info
        $table->string('base_name')->nullable();   // Added from first schema
        $table->string('slug')->unique()->nullable();
        $table->string('sku')->unique()->nullable();

        // Category Relation
        $table->foreignId('category_id')
              ->nullable()
              ->constrained('categories')
              ->onDelete('set null');

        // Status
        $table->enum('status', ['draft', 'published'])->default('draft');

        // Description
        $table->text('description')->nullable();

        // Images
        $table->string('thumbnail')->nullable();
        $table->string('base_thumbnail_url')->nullable(); 
        $table->json('gallery_images')->nullable();

        // Pricing
        $table->decimal('retail_price', 10, 2)->nullable();
        $table->decimal('wholesale_price', 10, 2)->nullable();
        $table->decimal('daraz_price', 10, 2)->nullable();
        $table->decimal('landed_cost', 10, 2)->nullable();

        // Physical Attributes
        $table->decimal('weight', 8, 2)->nullable();
        $table->string('dimensions')->nullable();

        // Other
        $table->json('tags')->nullable();

        // SEO
        $table->string('meta_title')->nullable();
        $table->text('meta_description')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};