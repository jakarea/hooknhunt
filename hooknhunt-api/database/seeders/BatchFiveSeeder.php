<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchFiveSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get Supplier & Product
        $supplier = DB::table('suppliers')->first();
        $variant = DB::table('product_variants')->where('sku', 'SHIRT-RED-L')->first();
        $admin = DB::table('users')->where('email', 'admin@system.com')->first();

        if ($supplier && $variant) {
            
            // 2. Create a Shipment
            $shipmentId = DB::table('shipments')->insertGetId([
                'supplier_id' => $supplier->id,
                'lot_number' => 'LOT-2025-001',
                'status' => 'shipped_to_bd',
                'exchange_rate' => 16.50, // 1 RMB = 16.50 BDT
                'total_china_cost_rmb' => 5000.00, // 100 pcs * 50 RMB
                'total_weight_actual' => 20.50, // kg
                'shipping_cost_intl' => 12000.00, // Air freight cost
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Add Items to Shipment
            DB::table('shipment_items')->insert([
                'shipment_id' => $shipmentId,
                'product_variant_id' => $variant->id,
                'ordered_qty' => 100,
                'received_qty' => 0, // Not received yet
                'unit_price_rmb' => 50.00,
                'created_at' => now(),
            ]);

            // 4. Add Tracking History
            DB::table('shipment_timelines')->insert([
                [
                    'shipment_id' => $shipmentId,
                    'status_label' => 'Order Placed',
                    'description' => 'Order created manually',
                    'updated_by' => $admin->id ?? 1,
                    'happened_at' => now()->subDays(5),
                    'created_at' => now(),
                ],
                [
                    'shipment_id' => $shipmentId,
                    'status_label' => 'Shipped from China',
                    'description' => 'Handed over to SkyNet Cargo. Tracking: SK123456',
                    'updated_by' => $admin->id ?? 1,
                    'happened_at' => now()->subDays(2),
                    'created_at' => now(),
                ]
            ]);
        }
    }
}