<?php

namespace Database\Seeders;

use App\Models\Inventory;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inventory = [
            // Professional Carbon Fiber Spinning Rod Variants
            ['product_variant_id' => 1, 'quantity' => 35], // HHCFSR-7M-ML
            ['product_variant_id' => 2, 'quantity' => 28], // HHCFSR-7M-M
            ['product_variant_id' => 3, 'quantity' => 42], // HHCFSR-8M-MH

            // Telescopic Travel Fishing Rod Variants
            ['product_variant_id' => 4, 'quantity' => 55], // HHTTR-5.5M-ML
            ['product_variant_id' => 5, 'quantity' => 48], // HHTTR-6M-M

            // Heavy Duty Casting Rod Variants
            ['product_variant_id' => 6, 'quantity' => 18], // SH-HDCR-8M-H
            ['product_variant_id' => 7, 'quantity' => 15], // SH-HDCR-9M-XH

            // Spinning Fishing Reel Variants
            ['product_variant_id' => 8, 'quantity' => 62], // HH-SFR-2500
            ['product_variant_id' => 9, 'quantity' => 58], // HH-SFR-3000
            ['product_variant_id' => 10, 'quantity' => 45], // HH-SFR-4000

            // Baitcasting Reel Pro Variants
            ['product_variant_id' => 11, 'quantity' => 38], // DW-BCP-150
            ['product_variant_id' => 12, 'quantity' => 32], // DW-BCP-200

            // Monofilament Fishing Line Variants
            ['product_variant_id' => 13, 'quantity' => 125], // HH-MFL-8LB-300
            ['product_variant_id' => 14, 'quantity' => 118], // HH-MFL-10LB-300
            ['product_variant_id' => 15, 'quantity' => 102], // HH-MFL-12LB-300
            ['product_variant_id' => 16, 'quantity' => 95], // HH-MFL-15LB-300

            // Braided Fishing Line Variants
            ['product_variant_id' => 17, 'quantity' => 88], // SH-BFL-20LB-150
            ['product_variant_id' => 18, 'quantity' => 75], // SH-BFL-30LB-150
            ['product_variant_id' => 19, 'quantity' => 62], // SH-BFL-50LB-150

            // Fluorocarbon Leader Line Variants
            ['product_variant_id' => 20, 'quantity' => 85], // DW-FCL-12LB-100
            ['product_variant_id' => 21, 'quantity' => 72], // DW-FCL-20LB-100

            // Premium Fishing Hooks Set
            ['product_variant_id' => 22, 'quantity' => 48], // HH-PFHS-50PCS

            // Swivels and Snap Clips Set
            ['product_variant_id' => 23, 'quantity' => 55], // PN-SSCS-100PCS

            // Hard Plastic Lure Set Variants
            ['product_variant_id' => 24, 'quantity' => 42], // HH-HPLS-MED-12
            ['product_variant_id' => 25, 'quantity' => 38], // HH-HPLS-LRG-12

            // Soft Plastic Worms Variants
            ['product_variant_id' => 26, 'quantity' => 68], // AG-SPW-6IN-20
            ['product_variant_id' => 27, 'quantity' => 52], // AG-SPW-8IN-15

            // Fishing Tackle Box
            ['product_variant_id' => 28, 'quantity' => 25], // HH-FTB-14X8

            // Fishing Pliers Tool
            ['product_variant_id' => 29, 'quantity' => 35], // SH-FPT-6.5IN

            // Fishing Backpack
            ['product_variant_id' => 30, 'quantity' => 22], // HH-FBP-30L

            // Fish Finder Portable
            ['product_variant_id' => 31, 'quantity' => 18], // SH-FFP-100FT
        ];

        // Insert inventory without duplicates
        foreach ($inventory as $item) {
            Inventory::firstOrCreate(
                ['product_variant_id' => $item['product_variant_id']],
                $item
            );
        }
    }
}