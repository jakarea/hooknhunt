<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create products table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('category_id')->index(); // References categories (Catalog module)
            $table->unsignedBigInteger('brand_id')->nullable()->index(); // References brands (Catalog module)
            $table->unsignedBigInteger('thumbnail_id')->nullable()->index(); // References media_files (Media module)

            $table->json('gallery_images')->nullable();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('video_url')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->json('seo_tags')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes(); // Soft delete - no data loss

            // NO foreign keys - module independence
            // $table->foreign('category_id')->constrained()->onDelete('restrict'); // ❌ REMOVED
            // $table->foreign('brand_id')->nullable()->constrained()->onDelete('set null'); // ❌ REMOVED
            // $table->foreign('thumbnail_id')->nullable()->constrained('media_files')->onDelete('set null'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
