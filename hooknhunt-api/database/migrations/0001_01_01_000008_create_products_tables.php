<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 16. Products (Master Info)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Global Name
            $table->string('slug')->unique();
            
            // Organization
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('brand_id')->nullable()->constrained()->onDelete('set null');
            
            // Media
            $table->foreignId('thumbnail_id')->nullable()->constrained('media_files')->onDelete('set null');
            $table->json('gallery_images')->nullable(); // Array of media_ids
            
            // Details
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('video_url')->nullable();
            
            // SEO (RankMath Style)
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->json('seo_tags')->nullable(); // Simple tags
            
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });

        // 17. Product Variants (The Actual SKU)
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            // Identification
            $table->string('sku')->unique(); // Stock Keeping Unit
            $table->string('custom_sku')->nullable();
            $table->string('variant_name')->nullable(); // e.g., "Red - XL"
            
            // Attributes (Flattened for now, can be normalized if needed)
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->foreignId('unit_id')->nullable()->constrained('units'); // kg/pc from Batch 1
            $table->decimal('unit_value', 8, 2)->default(1); // e.g. 1 (pc) or 0.5 (kg)
            
            // Default Pricing (Can be overridden in Channel Settings - Batch 4)
            $table->decimal('default_purchase_cost', 15, 2)->default(0); // Avg cost
            $table->decimal('default_retail_price', 15, 2)->default(0);
            $table->decimal('default_wholesale_price', 15, 2)->default(0);
            
            // Inventory Config
            $table->integer('stock_alert_level')->default(5); // Alert when below 5
            $table->integer('wholesale_moq')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 18. Product Search Term Pivot (Many-to-Many)
        Schema::create('product_search_term', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('search_term_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_search_term');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
    }
};