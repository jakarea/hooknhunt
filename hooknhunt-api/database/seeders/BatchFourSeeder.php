<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchFourSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get Variant ID (From Batch 3)
        $variant = DB::table('product_variants')->where('sku', 'SHIRT-RED-L')->first();

        if ($variant) {
            // Retail Web Price: 1200
            DB::table('product_channel_settings')->insert([
                'product_variant_id' => $variant->id,
                'channel' => 'retail_web',
                'price' => 1200.00,
                'is_active' => true,
                'created_at' => now()
            ]);

            // Wholesale Web Price: 800 (Only for wholesale customers)
            DB::table('product_channel_settings')->insert([
                'product_variant_id' => $variant->id,
                'channel' => 'wholesale_web',
                'price' => 800.00,
                'is_active' => true,
                'created_at' => now()
            ]);

            // Daraz Price: 1350 (Higher due to commission)
            DB::table('product_channel_settings')->insert([
                'product_variant_id' => $variant->id,
                'channel' => 'daraz',
                'custom_name' => 'Premium Shirt (Daraz Special)',
                'price' => 1350.00,
                'is_active' => true,
                'created_at' => now()
            ]);
        }

        // 2. Courier Rates (For Pathao/Steadfast)
        $courier = DB::table('couriers')->where('name', 'Pathao')->first();
        
        if ($courier) {
            DB::table('courier_zone_rates')->insert([
                [
                    'courier_id' => $courier->id,
                    'zone_name' => 'Inside Dhaka',
                    'base_charge' => 60.00,
                    'base_weight_kg' => 1.00,
                    'extra_charge_per_kg' => 15.00, // 1 কেজির বেশি হলে প্রতি কেজিতে ১৫ টাকা
                    'created_at' => now()
                ],
                [
                    'courier_id' => $courier->id,
                    'zone_name' => 'Outside Dhaka',
                    'base_charge' => 120.00,
                    'base_weight_kg' => 1.00,
                    'extra_charge_per_kg' => 25.00, // ঢাকার বাইরে ২৫ টাকা এক্সট্রা
                    'created_at' => now()
                ]
            ]);
        }

        // 3. Coupon
        DB::table('discounts')->insert([
            'code' => 'WELCOME50',
            'type' => 'fixed_amount',
            'amount' => 50.00,
            'is_active' => true,
            'created_at' => now()
        ]);
    }
}