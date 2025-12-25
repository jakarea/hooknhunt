<?php

namespace Database\Seeders;

use App\Models\PurchaseOrderItem;
use Illuminate\Database\Seeder;

class PurchaseOrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchaseOrderItems = [
            // PO-2025-001 (ID: 1) - Guangzhou Fishing Gear Co.
            [
                'po_number' => 1,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 1, // HHCFSR-7M-ML
                'quantity' => 20,
                'china_price' => 7.50,
                'unit_price' => 85.00,
                'total_price' => 1700.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 1,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 2, // HHCFSR-7M-M
                'quantity' => 15,
                'china_price' => 8.00,
                'unit_price' => 90.00,
                'total_price' => 1350.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 1,
                'product_id' => 4, // Spinning Fishing Reel
                'product_variant_id' => 4, // HH-SFR-2500
                'quantity' => 30,
                'china_price' => 3.50,
                'unit_price' => 40.00,
                'total_price' => 1200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-002 (ID: 2) - Shanghai Marine Supply Ltd.
            [
                'po_number' => 2,
                'product_id' => 7, // Braided Fishing Line
                'product_variant_id' => 11, // SH-BFL-20LB-150
                'quantity' => 50,
                'china_price' => 1.30,
                'unit_price' => 15.00,
                'total_price' => 750.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 2,
                'product_id' => 7, // Braided Fishing Line
                'product_variant_id' => 12, // SH-BFL-30LB-150
                'quantity' => 40,
                'china_price' => 1.50,
                'unit_price' => 18.00,
                'total_price' => 720.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 2,
                'product_id' => 9, // Premium Fishing Hooks Set
                'product_variant_id' => 19, // HH-PFHS-50PCS
                'quantity' => 25,
                'china_price' => 2.00,
                'unit_price' => 25.00,
                'total_price' => 625.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-003 (ID: 3) - Yiwu Fishing Tackle Factory
            [
                'po_number' => 3,
                'product_id' => 11, // Hard Plastic Lure Set
                'product_variant_id' => 23, // HH-HPLS-MED-12
                'quantity' => 60,
                'china_price' => 3.00,
                'unit_price' => 35.00,
                'total_price' => 2100.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 3,
                'product_id' => 11, // Hard Plastic Lure Set
                'product_variant_id' => 24, // HH-HPLS-LRG-12
                'quantity' => 40,
                'china_price' => 3.50,
                'unit_price' => 40.00,
                'total_price' => 1600.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 3,
                'product_id' => 12, // Soft Plastic Worms
                'product_variant_id' => 25, // AG-SPW-6IN-20
                'quantity' => 80,
                'china_price' => 1.20,
                'unit_price' => 15.00,
                'total_price' => 1200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-004 (ID: 4) - Beijing Outdoor Sports Co.
            [
                'po_number' => 4,
                'product_id' => 3, // Heavy Duty Casting Rod
                'product_variant_id' => 7, // SH-HDCR-8M-H
                'quantity' => 12,
                'china_price' => 10.00,
                'unit_price' => 120.00,
                'total_price' => 1440.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 4,
                'product_id' => 3, // Heavy Duty Casting Rod
                'product_variant_id' => 8, // SH-HDCR-9M-XH
                'quantity' => 8,
                'china_price' => 11.00,
                'unit_price' => 130.00,
                'total_price' => 1040.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 4,
                'product_id' => 5, // Baitcasting Reel Pro
                'product_variant_id' => 9, // DW-BCP-150
                'quantity' => 25,
                'china_price' => 7.00,
                'unit_price' => 80.00,
                'total_price' => 2000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-005 (ID: 5) - Shenzhen Fishing Technology
            [
                'po_number' => 5,
                'product_id' => 16, // Fish Finder Portable
                'product_variant_id' => 35, // SH-FFP-100FT
                'quantity' => 40,
                'china_price' => 6.50,
                'unit_price' => 80.00,
                'total_price' => 3200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-006 (ID: 6) - Ningbo Fishing Equipment Factory
            [
                'po_number' => 6,
                'product_id' => 2, // Telescopic Travel Fishing Rod
                'product_variant_id' => 3, // HHTTR-5.5M-ML
                'quantity' => 50,
                'china_price' => 3.50,
                'unit_price' => 45.00,
                'total_price' => 2250.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 6,
                'product_id' => 2, // Telescopic Travel Fishing Rod
                'product_variant_id' => 4, // HHTTR-6M-M
                'quantity' => 40,
                'china_price' => 4.00,
                'unit_price' => 50.00,
                'total_price' => 2000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 6,
                'product_id' => 13, // Fishing Tackle Box
                'product_variant_id' => 27, // HH-FTB-14X8
                'quantity' => 30,
                'china_price' => 5.00,
                'unit_price' => 60.00,
                'total_price' => 1800.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-007 (ID: 7) - Hangzhou Tackle Manufacturing
            [
                'po_number' => 7,
                'product_id' => 10, // Swivels and Snap Clips Set
                'product_variant_id' => 20, // PN-SSCS-100PCS
                'quantity' => 35,
                'china_price' => 1.60,
                'unit_price' => 20.00,
                'total_price' => 700.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 7,
                'product_id' => 14, // Fishing Pliers Tool
                'product_variant_id' => 28, // SH-FPT-6.5IN
                'quantity' => 20,
                'china_price' => 3.50,
                'unit_price' => 45.00,
                'total_price' => 900.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 7,
                'product_id' => 15, // Fishing Backpack
                'product_variant_id' => 29, // HH-FBP-30L
                'quantity' => 15,
                'china_price' => 4.50,
                'unit_price' => 55.00,
                'total_price' => 825.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-008 (ID: 8) - Qingdao Marine Supplies
            [
                'po_number' => 8,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 3, // HHCFSR-8M-MH
                'quantity' => 25,
                'china_price' => 8.50,
                'unit_price' => 95.00,
                'total_price' => 2375.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 8,
                'product_id' => 4, // Spinning Fishing Reel
                'product_variant_id' => 6, // HH-SFR-4000
                'quantity' => 30,
                'china_price' => 4.50,
                'unit_price' => 50.00,
                'total_price' => 1500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 8,
                'product_id' => 6, // Monofilament Fishing Line
                'product_variant_id' => 14, // HH-MFL-15LB-300
                'quantity' => 60,
                'china_price' => 1.00,
                'unit_price' => 12.00,
                'total_price' => 720.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 8,
                'product_id' => 8, // Fluorocarbon Leader Line
                'product_variant_id' => 18, // DW-FCL-20LB-100
                'quantity' => 25,
                'china_price' => 1.30,
                'unit_price' => 16.00,
                'total_price' => 400.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-009 (ID: 9) - Tianjin Fishing World
            [
                'po_number' => 9,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 1, // HHCFSR-7M-ML
                'quantity' => 100,
                'china_price' => 7.50,
                'unit_price' => 85.00,
                'total_price' => 8500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 9,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 2, // HHCFSR-7M-M
                'quantity' => 80,
                'china_price' => 8.00,
                'unit_price' => 90.00,
                'total_price' => 7200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 9,
                'product_id' => 4, // Spinning Fishing Reel
                'product_variant_id' => 4, // HH-SFR-2500
                'quantity' => 120,
                'china_price' => 3.50,
                'unit_price' => 40.00,
                'total_price' => 4800.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 9,
                'product_id' => 4, // Spinning Fishing Reel
                'product_variant_id' => 5, // HH-SFR-3000
                'quantity' => 100,
                'china_price' => 4.00,
                'unit_price' => 45.00,
                'total_price' => 4500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 9,
                'product_id' => 7, // Braided Fishing Line
                'product_variant_id' => 11, // SH-BFL-20LB-150
                'quantity' => 100,
                'china_price' => 1.30,
                'unit_price' => 15.00,
                'total_price' => 1500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-010 (ID: 10) - Chongqing Fishing Accessories
            [
                'po_number' => 10,
                'product_id' => 11, // Hard Plastic Lure Set
                'product_variant_id' => 23, // HH-HPLS-MED-12
                'quantity' => 40,
                'china_price' => 3.00,
                'unit_price' => 35.00,
                'total_price' => 1400.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 10,
                'product_id' => 11, // Hard Plastic Lure Set
                'product_variant_id' => 24, // HH-HPLS-LRG-12
                'quantity' => 30,
                'china_price' => 3.50,
                'unit_price' => 40.00,
                'total_price' => 1200.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 10,
                'product_id' => 12, // Soft Plastic Worms
                'product_variant_id' => 25, // AG-SPW-6IN-20
                'quantity' => 50,
                'china_price' => 1.20,
                'unit_price' => 15.00,
                'total_price' => 750.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2025-011 (ID: 11) - Xiamen Fishing Import Export
            [
                'po_number' => 11,
                'product_id' => 5, // Baitcasting Reel Pro
                'product_variant_id' => 10, // DW-BCP-200
                'quantity' => 50,
                'china_price' => 7.50,
                'unit_price' => 90.00,
                'total_price' => 4500.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 11,
                'product_id' => 6, // Monofilament Fishing Line
                'product_variant_id' => 11, // HH-MFL-8LB-300
                'quantity' => 80,
                'china_price' => 0.70,
                'unit_price' => 8.00,
                'total_price' => 640.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 11,
                'product_id' => 6, // Monofilament Fishing Line
                'product_variant_id' => 12, // HH-MFL-10LB-300
                'quantity' => 80,
                'china_price' => 0.80,
                'unit_price' => 9.00,
                'total_price' => 720.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 11,
                'product_id' => 6, // Monofilament Fishing Line
                'product_variant_id' => 13, // HH-MFL-12LB-300
                'quantity' => 60,
                'china_price' => 0.90,
                'unit_price' => 10.00,
                'total_price' => 600.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // PO-2024-012 (ID: 12) - Guangzhou Fishing Gear Co. (Previous year)
            [
                'po_number' => 12,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'product_variant_id' => 1, // HHCFSR-7M-ML
                'quantity' => 30,
                'china_price' => 7.50,
                'unit_price' => 85.00,
                'total_price' => 2550.00,
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(45),
            ],
            [
                'po_number' => 12,
                'product_id' => 4, // Spinning Fishing Reel
                'product_variant_id' => 5, // HH-SFR-3000
                'quantity' => 40,
                'china_price' => 4.00,
                'unit_price' => 45.00,
                'total_price' => 1800.00,
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(45),
            ],
            [
                'po_number' => 12,
                'product_id' => 7, // Braided Fishing Line
                'product_variant_id' => 13, // SH-BFL-50LB-150
                'quantity' => 50,
                'china_price' => 1.80,
                'unit_price' => 22.00,
                'total_price' => 1100.00,
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(45),
            ],
        ];

        PurchaseOrderItem::insert($purchaseOrderItems);
    }
}