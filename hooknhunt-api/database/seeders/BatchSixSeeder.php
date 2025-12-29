<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Shipment; // Assuming model exists

class BatchSixSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get the Shipment & Variant info
        // আমরা ধরে নিচ্ছি Batch 5 এর শিপমেন্টটি বগুড়া ওয়ারহাউজে পৌঁছেছে
        $shipment = DB::table('shipments')->where('lot_number', 'LOT-2025-001')->first();
        $variant = DB::table('product_variants')->where('sku', 'SHIRT-RED-L')->first();
        $warehouse = DB::table('warehouses')->where('type', 'local_hub')->first(); // Bogura

        if ($shipment && $variant && $warehouse) {
            
            // Landed Cost Calculation (Simulated)
            // (China Cost + Shipping) / Qty
            // (5000 * 16.5 + 12000) / 100 = (82500 + 12000) / 100 = 945.00 BDT/pc
            $landedCost = 945.00;

            // 2. Create Inventory Batch (Stock In)
            $batchId = DB::table('inventory_batches')->insertGetId([
                'product_variant_id' => $variant->id,
                'warehouse_id' => $warehouse->id,
                'batch_no' => $shipment->lot_number,
                'cost_price' => $landedCost,
                'initial_qty' => 100,
                'remaining_qty' => 100, // এখনো বিক্রি হয়নি
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Create Ledger Entry (History)
            DB::table('stock_ledgers')->insert([
                'product_variant_id' => $variant->id,
                'warehouse_id' => $warehouse->id,
                'inventory_batch_id' => $batchId,
                'type' => 'purchase_in',
                'qty_change' => 100,
                'reference_type' => 'App\Models\Shipment', // Polymorphic link
                'reference_id' => $shipment->id,
                'date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // 4. Update Shipment Status
            DB::table('shipments')->where('id', $shipment->id)->update(['status' => 'received_bogura']);
        }
    }
}