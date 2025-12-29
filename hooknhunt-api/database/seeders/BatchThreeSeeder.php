<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BatchThreeSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $catElectronics = DB::table('categories')->insertGetId([
            'name' => 'Electronics', 'slug' => 'electronics', 'created_at' => now()
        ]);
        $catFashion = DB::table('categories')->insertGetId([
            'name' => 'Men\'s Fashion', 'slug' => 'mens-fashion', 'created_at' => now()
        ]);
        // Sub-category
        $catShirts = DB::table('categories')->insertGetId([
            'name' => 'Casual Shirts', 'slug' => 'casual-shirts', 'parent_id' => $catFashion, 'created_at' => now()
        ]);

        // 2. Brands
        $brandSamsung = DB::table('brands')->insertGetId(['name' => 'Samsung', 'slug' => 'samsung', 'created_at' => now()]);
        $brandLocal = DB::table('brands')->insertGetId(['name' => 'Deshi Brand', 'slug' => 'deshi-brand', 'created_at' => now()]);

        // 3. Search Terms
        $termEid = DB::table('search_terms')->insertGetId(['term' => 'Eid Collection', 'hits' => 100]);
        $termCotton = DB::table('search_terms')->insertGetId(['term' => 'Cotton', 'hits' => 50]);

        // 4. Create Product: "Premium Cotton Shirt"
        $prodShirt = DB::table('products')->insertGetId([
            'name' => 'Premium Cotton Shirt',
            'slug' => 'premium-cotton-shirt',
            'category_id' => $catShirts,
            'brand_id' => $brandLocal,
            'description' => 'High quality cotton shirt for summer.',
            'status' => 'published',
            'created_at' => now()
        ]);

        // Attach Search Terms
        DB::table('product_search_term')->insert([
            ['product_id' => $prodShirt, 'search_term_id' => $termEid],
            ['product_id' => $prodShirt, 'search_term_id' => $termCotton],
        ]);

        // 5. Create Variants (SKUs)
        // Unit ID 1 = Piece (Assuming from Batch 1)
        DB::table('product_variants')->insert([
            [
                'product_id' => $prodShirt,
                'sku' => 'SHIRT-RED-L',
                'variant_name' => 'Red - Large',
                'size' => 'L',
                'color' => 'Red',
                'unit_id' => 1,
                'default_retail_price' => 1200.00,
                'default_wholesale_price' => 800.00,
                'created_at' => now()
            ],
            [
                'product_id' => $prodShirt,
                'sku' => 'SHIRT-RED-XL',
                'variant_name' => 'Red - Extra Large',
                'size' => 'XL',
                'color' => 'Red',
                'unit_id' => 1,
                'default_retail_price' => 1250.00,
                'default_wholesale_price' => 850.00,
                'created_at' => now()
            ]
        ]);
    }
}