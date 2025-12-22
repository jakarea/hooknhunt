<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderItems = [
            // Order ID: 1 (ORD-2025-001) - Rahim Ahmed
            [
                'order_id' => 1,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'variant_id' => 1, // HHCFSR-7M-ML
                'product_name' => 'Professional Carbon Fiber Spinning Rod 7ft Medium-Light',
                'product_sku' => 'HHCFSR-7M-ML',
                'product_image' => 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=7ft+ML',
                'unit_price' => 280.00,
                'quantity' => 1,
                'total_price' => 280.00,
                'product_attributes' => json_encode([
                    'length' => '7ft',
                    'power' => 'Medium-Light',
                    'sections' => '2',
                    'material' => 'Carbon Fiber'
                ]),
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'order_id' => 1,
                'product_id' => 6, // Monofilament Fishing Line
                'variant_id' => 13, // HH-MFL-8LB-300
                'product_name' => 'Monofilament Line 8lb Test 300 yards',
                'product_sku' => 'HH-MFL-8LB-300',
                'product_image' => 'https://via.placeholder.com/400x400/06B6D4/FFFFFF?text=8lb',
                'unit_price' => 45.00,
                'quantity' => 2,
                'total_price' => 90.00,
                'product_attributes' => json_encode([
                    'test_weight' => '8lb',
                    'length' => '300 yards',
                    'material' => 'Nylon',
                    'diameter' => '0.30mm'
                ]),
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'order_id' => 1,
                'product_id' => 9, // Premium Fishing Hooks Set
                'variant_id' => 22, // HH-PFHS-50PCS
                'product_name' => 'Premium Fishing Hooks Set 50 pieces',
                'product_sku' => 'HH-PFHS-50PCS',
                'product_image' => 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=50+Pcs',
                'unit_price' => 160.00,
                'quantity' => 1,
                'total_price' => 160.00,
                'product_attributes' => json_encode([
                    'pieces' => '50',
                    'sizes' => '6, 8, 10, 12, 14',
                    'types' => 'J-Hook, Circle, Treble',
                    'coating' => 'Anti-Rust'
                ]),
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],

            // Order ID: 2 (ORD-2025-002) - Karim Rahman
            [
                'order_id' => 2,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'variant_id' => 2, // HHCFSR-7M-M
                'product_name' => 'Professional Carbon Fiber Spinning Rod 7ft Medium',
                'product_sku' => 'HHCFSR-7M-M',
                'product_image' => 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=7ft+M',
                'unit_price' => 300.00,
                'quantity' => 1,
                'total_price' => 300.00,
                'product_attributes' => json_encode([
                    'length' => '7ft',
                    'power' => 'Medium',
                    'sections' => '2',
                    'material' => 'Carbon Fiber'
                ]),
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'order_id' => 2,
                'product_id' => 4, // Spinning Fishing Reel
                'variant_id' => 9, // HH-SFR-3000
                'product_name' => 'Spinning Fishing Reel 3000 Size',
                'product_sku' => 'HH-SFR-3000',
                'product_image' => 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=3000',
                'unit_price' => 250.00,
                'quantity' => 1,
                'total_price' => 250.00,
                'product_attributes' => json_encode([
                    'size' => '3000',
                    'bearings' => '10 + 1',
                    'gear_ratio' => '5.2:1',
                    'line_capacity' => '200yds/12lb'
                ]),
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'order_id' => 2,
                'product_id' => 7, // Braided Fishing Line
                'variant_id' => 17, // SH-BFL-20LB-150
                'product_name' => 'Braided Line 20lb Test 150 yards',
                'product_sku' => 'SH-BFL-20LB-150',
                'product_image' => 'https://via.placeholder.com/400x400/84CC16/FFFFFF?text=20lb',
                'unit_price' => 80.00,
                'quantity' => 2,
                'total_price' => 160.00,
                'product_attributes' => json_encode([
                    'test_weight' => '20lb',
                    'length' => '150 yards',
                    'material' => 'PE Fiber',
                    'color' => 'Hi-Vis Yellow'
                ]),
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'order_id' => 2,
                'product_id' => 13, // Fishing Tackle Box
                'variant_id' => 28, // HH-FTB-14X8
                'product_name' => 'Fishing Tackle Box 14" x 8"',
                'product_sku' => 'HH-FTB-14X8',
                'product_image' => 'https://via.placeholder.com/400x400/DC2626/FFFFFF?text=14x8',
                'unit_price' => 350.00,
                'quantity' => 1,
                'total_price' => 350.00,
                'product_attributes' => json_encode([
                    'dimensions' => '14" x 8" x 7"',
                    'material' => 'Polypropylene',
                    'compartments' => '4 trays + storage',
                    'color' => 'Black/Red'
                ]),
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'order_id' => 2,
                'product_id' => 15, // Fishing Backpack
                'variant_id' => 30, // HH-FBP-30L
                'product_name' => 'Fishing Backpack 30 liters',
                'product_sku' => 'HH-FBP-30L',
                'product_image' => 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=30L',
                'unit_price' => 190.00,
                'quantity' => 1,
                'total_price' => 190.00,
                'product_attributes' => json_encode([
                    'capacity' => '30 liters',
                    'material' => 'Nylon Oxford',
                    'rod_holders' => '2 removable',
                    'color' => 'Camo/Black'
                ]),
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],

            // Order ID: 3 (ORD-2025-003) - Abdul Wholesaler (Wholesale Order)
            [
                'order_id' => 3,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'variant_id' => 1, // HHCFSR-7M-ML
                'product_name' => 'Carbon Fiber Spinning Rod 7ft ML Wholesale',
                'product_sku' => 'HHCFSR-7M-ML',
                'product_image' => 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=7ft+ML',
                'unit_price' => 220.00,
                'quantity' => 10,
                'total_price' => 2200.00,
                'product_attributes' => json_encode([
                    'length' => '7ft',
                    'power' => 'Medium-Light',
                    'sections' => '2',
                    'material' => 'Carbon Fiber'
                ]),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'order_id' => 3,
                'product_id' => 4, // Spinning Fishing Reel
                'variant_id' => 9, // HH-SFR-3000
                'product_name' => 'Spinning Reel 3000 Wholesale',
                'product_sku' => 'HH-SFR-3000',
                'product_image' => 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=3000',
                'unit_price' => 200.00,
                'quantity' => 5,
                'total_price' => 1000.00,
                'product_attributes' => json_encode([
                    'size' => '3000',
                    'bearings' => '10 + 1',
                    'gear_ratio' => '5.2:1',
                    'line_capacity' => '200yds/12lb'
                ]),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],

            // Order ID: 4 (ORD-2025-004) - Mohammad Shopkeeper (Wholesale Order)
            [
                'order_id' => 4,
                'product_id' => 7, // Braided Fishing Line
                'variant_id' => 17, // SH-BFL-20LB-150
                'product_name' => 'Braided Line 20lb Wholesale',
                'product_sku' => 'SH-BFL-20LB-150',
                'product_image' => 'https://via.placeholder.com/400x400/84CC16/FFFFFF?text=20lb',
                'unit_price' => 70.00,
                'quantity' => 15,
                'total_price' => 1050.00,
                'product_attributes' => json_encode([
                    'test_weight' => '20lb',
                    'length' => '150 yards',
                    'material' => 'PE Fiber',
                    'color' => 'Hi-Vis Yellow'
                ]),
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ],
            [
                'order_id' => 4,
                'product_id' => 11, // Hard Plastic Lure Set
                'variant_id' => 24, // HH-HPLS-LRG-12
                'product_name' => 'Hard Lures Large 12pcs Wholesale',
                'product_sku' => 'HH-HPLS-LRG-12',
                'product_image' => 'https://via.placeholder.com/400x400/9333EA/FFFFFF?text=Large+12',
                'unit_price' => 230.00,
                'quantity' => 2,
                'total_price' => 460.00,
                'product_attributes' => json_encode([
                    'quantity' => '12 lures',
                    'weights' => '7g, 10g',
                    'diving_depth' => '1-3 meters',
                    'hook_size' => '#6'
                ]),
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ],
            [
                'order_id' => 4,
                'product_id' => 12, // Soft Plastic Worms
                'variant_id' => 26, // AG-SPW-6IN-20
                'product_name' => 'Soft Worms 6in 20pcs Wholesale',
                'product_sku' => 'AG-SPW-6IN-20',
                'product_image' => 'https://via.placeholder.com/400x400/059669/FFFFFF?text=6in+20',
                'unit_price' => 150.00,
                'quantity' => 2,
                'total_price' => 300.00,
                'product_attributes' => json_encode([
                    'length' => '6 inches',
                    'quantity' => '20 worms',
                    'colors' => '5 varieties',
                    'scent' => 'Anise infused'
                ]),
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ],

            // Order ID: 5 (ORD-2025-005) - Fahim Customer
            [
                'order_id' => 5,
                'product_id' => 2, // Telescopic Travel Fishing Rod
                'variant_id' => 4, // HHTTR-6M-M
                'product_name' => 'Telescopic Travel Rod 6ft Medium',
                'product_sku' => 'HHTTR-6M-M',
                'product_image' => 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=6ft+M',
                'unit_price' => 200.00,
                'quantity' => 1,
                'total_price' => 200.00,
                'product_attributes' => json_encode([
                    'extended_length' => '6ft',
                    'collapsed_length' => '15in',
                    'power' => 'Medium',
                    'sections' => '7'
                ]),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'order_id' => 5,
                'product_id' => 10, // Swivels and Snap Clips Set
                'variant_id' => 23, // PN-SSCS-100PCS
                'product_name' => 'Swivels Snap Clips Set 100 pieces',
                'product_sku' => 'PN-SSCS-100PCS',
                'product_image' => 'https://via.placeholder.com/400x400/14B8A6/FFFFFF?text=100+Pcs',
                'unit_price' => 120.00,
                'quantity' => 1,
                'total_price' => 120.00,
                'product_attributes' => json_encode([
                    'total_pieces' => '100',
                    'swivel_sizes' => '#5, #7, #10',
                    'types' => 'Barrel, Ball Bearing',
                    'material' => 'Stainless Steel'
                ]),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'order_id' => 5,
                'product_id' => 6, // Monofilament Fishing Line
                'variant_id' => 14, // HH-MFL-15LB-300
                'product_name' => 'Monofilament Line 15lb Test 300 yards',
                'product_sku' => 'HH-MFL-15LB-300',
                'product_image' => 'https://via.placeholder.com/400x400/06B6D4/FFFFFF?text=15lb',
                'unit_price' => 65.00,
                'quantity' => 1,
                'total_price' => 65.00,
                'product_attributes' => json_encode([
                    'test_weight' => '15lb',
                    'length' => '300 yards',
                    'material' => 'Nylon',
                    'diameter' => '0.35mm'
                ]),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],

            // Order ID: 6 (ORD-2025-006) - Rahim Ahmed (Repeat)
            [
                'order_id' => 6,
                'product_id' => 7, // Braided Fishing Line
                'variant_id' => 18, // SH-BFL-30LB-150
                'product_name' => 'Braided Line 30lb Test 150 yards',
                'product_sku' => 'SH-BFL-30LB-150',
                'product_image' => 'https://via.placeholder.com/400x400/84CC16/FFFFFF?text=30lb',
                'unit_price' => 95.00,
                'quantity' => 1,
                'total_price' => 95.00,
                'product_attributes' => json_encode([
                    'test_weight' => '30lb',
                    'length' => '150 yards',
                    'material' => 'PE Fiber',
                    'color' => 'Hi-Vis Yellow'
                ]),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'order_id' => 6,
                'product_id' => 9, // Premium Fishing Hooks Set
                'variant_id' => 22, // HH-PFHS-50PCS
                'product_name' => 'Premium Fishing Hooks Set 50 pieces',
                'product_sku' => 'HH-PFHS-50PCS',
                'product_image' => 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=50+Pcs',
                'unit_price' => 55.00,
                'quantity' => 1,
                'total_price' => 55.00,
                'product_attributes' => json_encode([
                    'pieces' => '50',
                    'sizes' => '6, 8, 10, 12, 14',
                    'types' => 'J-Hook, Circle, Treble',
                    'coating' => 'Anti-Rust'
                ]),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],

            // Order ID: 7 (ORD-2025-007) - Karim Rahman (Repeat)
            [
                'order_id' => 7,
                'product_id' => 16, // Fish Finder Portable
                'variant_id' => 31, // SH-FFP-100FT
                'product_name' => 'Fish Finder Portable 100 feet depth',
                'product_sku' => 'SH-FFP-100FT',
                'product_image' => 'https://via.placeholder.com/400x400/0891B2/FFFFFF?text=100ft',
                'unit_price' => 550.00,
                'quantity' => 1,
                'total_price' => 550.00,
                'product_attributes' => json_encode([
                    'display' => '2.8" LCD',
                    'depth_range' => '3-100 feet',
                    'detection_angle' => '90 degrees',
                    'waterproof' => 'IPX4'
                ]),
                'created_at' => now()->subHours(18),
                'updated_at' => now()->subHours(18),
            ],
            [
                'order_id' => 7,
                'product_id' => 14, // Fishing Pliers Tool
                'variant_id' => 29, // SH-FPT-6.5IN
                'product_name' => 'Fishing Pliers Tool 6.5 inch',
                'product_sku' => 'SH-FPT-6.5IN',
                'product_image' => 'https://via.placeholder.com/400x400/6366F1/FFFFFF?text=6.5in',
                'unit_price' => 280.00,
                'quantity' => 1,
                'total_price' => 280.00,
                'product_attributes' => json_encode([
                    'length' => '6.5 inches',
                    'material' => 'Stainless Steel',
                    'features' => 'Line cutter, Split ring opener, Crimper',
                    'grip' => 'Non-slip rubber'
                ]),
                'created_at' => now()->subHours(18),
                'updated_at' => now()->subHours(18),
            ],

            // Order ID: 8 (ORD-2025-008) - Seller One (Staff)
            [
                'order_id' => 8,
                'product_id' => 5, // Baitcasting Reel Pro
                'variant_id' => 11, // DW-BCP-150
                'product_name' => 'Baitcasting Reel Pro 150 Size',
                'product_sku' => 'DW-BCP-150',
                'product_image' => 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=150',
                'unit_price' => 320.00,
                'quantity' => 1,
                'total_price' => 320.00,
                'product_attributes' => json_encode([
                    'size' => '150',
                    'bearings' => '8 + 1',
                    'gear_ratio' => '7.3:1',
                    'cast_control' => 'Magnetic'
                ]),
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(12),
            ],

            // Order ID: 9 (ORD-2025-009) - Seller Two (Staff)
            [
                'order_id' => 9,
                'product_id' => 11, // Hard Plastic Lure Set
                'variant_id' => 23, // HH-HPLS-MED-12
                'product_name' => 'Hard Plastic Lure Set Medium 12 pieces',
                'product_sku' => 'HH-HPLS-MED-12',
                'product_image' => 'https://via.placeholder.com/400x400/9333EA/FFFFFF?text=Medium+12',
                'unit_price' => 250.00,
                'quantity' => 1,
                'total_price' => 250.00,
                'product_attributes' => json_encode([
                    'quantity' => '12 lures',
                    'weights' => '5g, 7g',
                    'diving_depth' => '1-3 meters',
                    'hook_size' => '#6'
                ]),
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subHours(6),
            ],

            // Order ID: 10 (ORD-2025-010) - Fahim Customer (Repeat)
            [
                'order_id' => 10,
                'product_id' => 1, // Professional Carbon Fiber Spinning Rod
                'variant_id' => 3, // HHCFSR-8M-MH
                'product_name' => 'Carbon Fiber Spinning Rod 8ft Medium-Heavy',
                'product_sku' => 'HHCFSR-8M-MH',
                'product_image' => 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=8ft+MH',
                'unit_price' => 320.00,
                'quantity' => 1,
                'total_price' => 320.00,
                'product_attributes' => json_encode([
                    'length' => '8ft',
                    'power' => 'Medium-Heavy',
                    'sections' => '2',
                    'material' => 'Carbon Fiber'
                ]),
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(3),
            ],
            [
                'order_id' => 10,
                'product_id' => 4, // Spinning Fishing Reel
                'variant_id' => 10, // HH-SFR-4000
                'product_name' => 'Spinning Fishing Reel 4000 Size',
                'product_sku' => 'HH-SFR-4000',
                'product_image' => 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=4000',
                'unit_price' => 280.00,
                'quantity' => 1,
                'total_price' => 280.00,
                'product_attributes' => json_encode([
                    'size' => '4000',
                    'bearings' => '10 + 1',
                    'gear_ratio' => '5.2:1',
                    'line_capacity' => '200yds/15lb'
                ]),
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(3),
            ],

            // Order ID: 11 (ORD-2025-011) - Abdul Wholesaler (Repeat Wholesale)
            [
                'order_id' => 11,
                'product_id' => 4, // Spinning Fishing Reel
                'variant_id' => 8, // HH-SFR-2500
                'product_name' => 'Spinning Reel 2500 Wholesale',
                'product_sku' => 'HH-SFR-2500',
                'product_image' => 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=2500',
                'unit_price' => 180.00,
                'quantity' => 20,
                'total_price' => 3600.00,
                'product_attributes' => json_encode([
                    'size' => '2500',
                    'bearings' => '10 + 1',
                    'gear_ratio' => '5.2:1',
                    'line_capacity' => '200yds/10lb'
                ]),
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'order_id' => 11,
                'product_id' => 6, // Monofilament Fishing Line
                'variant_id' => 13, // HH-MFL-8LB-300
                'product_name' => 'Monofilament Line 8lb Wholesale',
                'product_sku' => 'HH-MFL-8LB-300',
                'product_image' => 'https://via.placeholder.com/400x400/06B6D4/FFFFFF?text=8lb',
                'unit_price' => 35.00,
                'quantity' => 10,
                'total_price' => 350.00,
                'product_attributes' => json_encode([
                    'test_weight' => '8lb',
                    'length' => '300 yards',
                    'material' => 'Nylon',
                    'diameter' => '0.30mm'
                ]),
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'order_id' => 11,
                'product_id' => 8, // Fluorocarbon Leader Line
                'variant_id' => 20, // DW-FCL-12LB-100
                'product_name' => 'Fluorocarbon Leader 12lb Wholesale',
                'product_sku' => 'DW-FCL-12LB-100',
                'product_image' => 'https://via.placeholder.com/400x400/F97316/FFFFFF?text=12lb',
                'unit_price' => 80.00,
                'quantity' => 5,
                'total_price' => 400.00,
                'product_attributes' => json_encode([
                    'test_weight' => '12lb',
                    'length' => '100 yards',
                    'material' => '100% Fluorocarbon',
                    'visibility' => 'Invisible Underwater'
                ]),
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
        ];

        // Insert order items only for existing orders
        foreach ($orderItems as $item) {
            // Check if the order exists before creating the order item
            $orderExists = \App\Models\Order::find($item['order_id']);
            if ($orderExists) {
                OrderItem::firstOrCreate(
                    [
                        'order_id' => $item['order_id'],
                        'product_id' => $item['product_id'],
                        'variant_id' => $item['variant_id'],
                    ],
                    $item
                );
            }
        }
    }
}