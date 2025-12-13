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
        Schema::table('product_variants', function (Blueprint $table) {
            // Add internal_name field for internal tracking
            $table->string('internal_name')->nullable()->after('sku');

            // Add platform-specific thumbnail fields
            $table->string('retail_thumbnail_url')->nullable()->after('retail_offer_end_date');
            $table->string('wholesale_thumbnail_url')->nullable()->after('wholesale_offer_end_date');
            $table->string('daraz_thumbnail_url')->nullable()->after('daraz_offer_end_date');

            // Add platform-specific SEO fields for Retail
            $table->string('retail_meta_title')->nullable()->after('retail_thumbnail_url');
            $table->text('retail_meta_description')->nullable()->after('retail_meta_title');
            $table->string('retail_meta_keywords')->nullable()->after('retail_meta_description');

            // Add platform-specific SEO fields for Wholesale
            $table->string('wholesale_meta_title')->nullable()->after('wholesale_thumbnail_url');
            $table->text('wholesale_meta_description')->nullable()->after('wholesale_meta_title');
            $table->string('wholesale_meta_keywords')->nullable()->after('wholesale_meta_description');

            // Add platform-specific SEO fields for Daraz
            $table->string('daraz_meta_title')->nullable()->after('daraz_thumbnail_url');
            $table->text('daraz_meta_description')->nullable()->after('daraz_meta_title');
            $table->string('daraz_meta_keywords')->nullable()->after('daraz_meta_description');
        });

        Schema::table('products', function (Blueprint $table) {
            // Add gallery_images as JSON field if not exists
            if (!Schema::hasColumn('products', 'gallery_images')) {
                $table->json('gallery_images')->nullable()->after('thumbnail');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn([
                'internal_name',
                'retail_thumbnail_url',
                'wholesale_thumbnail_url',
                'daraz_thumbnail_url',
                'retail_meta_title',
                'retail_meta_description',
                'retail_meta_keywords',
                'wholesale_meta_title',
                'wholesale_meta_description',
                'wholesale_meta_keywords',
                'daraz_meta_title',
                'daraz_meta_description',
                'daraz_meta_keywords',
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'gallery_images')) {
                $table->dropColumn('gallery_images');
            }
        });
    }
};
