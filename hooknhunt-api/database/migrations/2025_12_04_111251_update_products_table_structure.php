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
        Schema::table('products', function (Blueprint $table) {
            // 1. Cleanup: Remove old columns (moved to product_variants)
            $table->dropColumn([
                'sku', 
                'retail_price', 
                'wholesale_price', 
                'daraz_price', 
                'landed_cost'
            ]);

            // 2. Upgrade: Add new Standard E-commerce columns
            
            // Link to brands table (Nullable ensures existing products don't break)
            $table->foreignId('brand_id')
                  ->nullable()
                  ->constrained('brands')
                  ->onDelete('set null')
                  ->after('category_id');

            $table->text('short_description')->nullable()->after('description');
            
            // JSON field for specs like {"Material": "Cotton", "Warranty": "1 Year"}
            $table->json('specifications')->nullable()->after('short_description');
            
            $table->string('video_url')->nullable()->after('thumbnail');
            
            $table->boolean('is_featured')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Restore columns if we rollback (Make them nullable to avoid errors)
            $table->string('sku')->nullable();
            $table->decimal('retail_price', 10, 2)->nullable();
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->decimal('daraz_price', 10, 2)->nullable();
            $table->decimal('landed_cost', 10, 2)->nullable();

            // Remove the new columns
            $table->dropForeign(['brand_id']);
            $table->dropColumn([
                'brand_id', 
                'short_description', 
                'specifications', 
                'video_url', 
                'is_featured'
            ]);
        });
    }
};
