<?php

namespace Database\Seeders;

use App\Models\PurchaseOrder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PurchaseOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchaseOrders = [
            [
                'po_number' => 'PO-2025-001',
                'supplier_id' => 1, // Guangzhou Fishing Gear Co.
                'exchange_rate' => 11.50,
                'order_date' => '2025-01-05',
                'expected_date' => '2025-01-20',
                'total_amount' => 1250.00,
                'created_by' => 4, // Store Keeper
                'status' => 'approved',
                'courier_name' => 'DHL Express',
                'tracking_number' => 'DHL123456789',
                'lot_number' => 'LOT-2025-GZ001',
                'shipping_method' => 'air',
                'shipping_cost' => 85.00,
                'bd_courier_tracking' => 'SA-67890',
                'total_weight' => 12.50,
                'extra_cost_global' => 25.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-002',
                'supplier_id' => 2, // Shanghai Marine Supply Ltd.
                'exchange_rate' => 11.45,
                'order_date' => '2025-01-08',
                'expected_date' => '2025-01-25',
                'total_amount' => 850.00,
                'created_by' => 4, // Store Keeper
                'status' => 'received',
                'courier_name' => 'FedEx',
                'tracking_number' => 'FDX987654321',
                'lot_number' => 'LOT-2025-SH002',
                'shipping_method' => 'air',
                'shipping_cost' => 65.00,
                'bd_courier_tracking' => 'SA-54321',
                'total_weight' => 8.75,
                'extra_cost_global' => 20.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-003',
                'supplier_id' => 3, // Yiwu Fishing Tackle Factory
                'exchange_rate' => 11.40,
                'order_date' => '2025-01-10',
                'expected_date' => '2025-02-05',
                'total_amount' => 2200.00,
                'created_by' => 2, // Admin
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 25.00,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-004',
                'supplier_id' => 4, // Beijing Outdoor Sports Co.
                'exchange_rate' => 11.55,
                'order_date' => '2025-01-12',
                'expected_date' => '2025-01-30',
                'total_amount' => 1500.00,
                'created_by' => 4, // Store Keeper
                'status' => 'approved',
                'courier_name' => 'UPS',
                'tracking_number' => 'UPS555555555',
                'lot_number' => 'LOT-2025-BJ004',
                'shipping_method' => 'air',
                'shipping_cost' => 95.00,
                'bd_courier_tracking' => 'SA-22222',
                'total_weight' => 15.20,
                'extra_cost_global' => 30.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-005',
                'supplier_id' => 5, // Shenzhen Fishing Technology
                'exchange_rate' => 11.48,
                'order_date' => '2025-01-15',
                'expected_date' => '2025-02-10',
                'total_amount' => 3200.00,
                'created_by' => 2, // Admin
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 18.90,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-006',
                'supplier_id' => 6, // Ningbo Fishing Equipment Factory
                'exchange_rate' => 11.42,
                'order_date' => '2025-01-18',
                'expected_date' => '2025-02-15',
                'total_amount' => 1750.00,
                'created_by' => 4, // Store Keeper
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 22.50,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-007',
                'supplier_id' => 7, // Hangzhou Tackle Manufacturing
                'exchange_rate' => 11.38,
                'order_date' => '2025-01-20',
                'expected_date' => '2025-02-08',
                'total_amount' => 980.00,
                'created_by' => 4, // Store Keeper
                'status' => 'approved',
                'courier_name' => 'TNT',
                'tracking_number' => 'TNT111111111',
                'lot_number' => 'LOT-2025-HZ007',
                'shipping_method' => 'air',
                'shipping_cost' => 55.00,
                'bd_courier_tracking' => 'SA-99999',
                'total_weight' => 11.80,
                'extra_cost_global' => 15.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-008',
                'supplier_id' => 8, // Qingdao Marine Supplies
                'exchange_rate' => 11.52,
                'order_date' => '2025-01-22',
                'expected_date' => '2025-02-20',
                'total_amount' => 2650.00,
                'created_by' => 2, // Admin
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 28.70,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-009',
                'supplier_id' => 9, // Tianjin Fishing World
                'exchange_rate' => 11.46,
                'order_date' => '2025-01-25',
                'expected_date' => '2025-03-01',
                'total_amount' => 4100.00,
                'created_by' => 2, // Admin
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 35.00,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-010',
                'supplier_id' => 10, // Chongqing Fishing Accessories
                'exchange_rate' => 11.44,
                'order_date' => '2025-01-28',
                'expected_date' => '2025-02-25',
                'total_amount' => 1350.00,
                'created_by' => 4, // Store Keeper
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 16.30,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2025-011',
                'supplier_id' => 11, // Xiamen Fishing Import Export
                'exchange_rate' => 11.50,
                'order_date' => '2025-02-01',
                'expected_date' => '2025-03-05',
                'total_amount' => 2950.00,
                'created_by' => 2, // Admin
                'status' => 'pending',
                'courier_name' => null,
                'tracking_number' => null,
                'lot_number' => null,
                'shipping_method' => null,
                'shipping_cost' => null,
                'bd_courier_tracking' => null,
                'total_weight' => 24.80,
                'extra_cost_global' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'po_number' => 'PO-2024-012', // From previous year
                'supplier_id' => 1, // Guangzhou Fishing Gear Co.
                'exchange_rate' => 11.35,
                'order_date' => '2024-12-15',
                'expected_date' => '2025-01-10',
                'total_amount' => 1850.00,
                'created_by' => 4, // Store Keeper
                'status' => 'received',
                'courier_name' => 'DHL Express',
                'tracking_number' => 'DHL432109876',
                'lot_number' => 'LOT-2024-GZ012',
                'shipping_method' => 'air',
                'shipping_cost' => 110.00,
                'bd_courier_tracking' => 'SA-13579',
                'total_weight' => 20.50,
                'extra_cost_global' => 35.00,
                'created_at' => now()->subDays(45),
                'updated_at' => now()->subDays(20),
            ],
        ];

        PurchaseOrder::insert($purchaseOrders);
    }
}