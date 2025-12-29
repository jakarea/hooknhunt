<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\InventoryBatch; // Model required for logic

class BatchSevenSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Customer
        $customerId = DB::table('customers')->insertGetId([
            'name' => 'Walk-in Customer',
            'phone' => '01700000000',
            'type' => 'retail',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Prepare Order Data
        $variant = DB::table('product_variants')->where('sku', 'SHIRT-RED-L')->first();
        $qtyToSell = 5;
        $sellingPrice = 1200.00; // Retail Price
        $totalSellingPrice = $qtyToSell * $sellingPrice;

        // 3. FIFO Logic Simulation (Complex Part)
        // আমরা ম্যানুয়ালি বের করছি, কিন্তু অ্যাপে এটি সার্ভিসে থাকবে।
        // Batch 6 এ আমাদের Cost ছিল ৯৪৫ টাকা।
        
        $batch = DB::table('inventory_batches')
                    ->where('product_variant_id', $variant->id)
                    ->where('remaining_qty', '>', 0)
                    ->orderBy('created_at', 'asc') // Oldest first
                    ->first();

        if ($batch && $batch->remaining_qty >= $qtyToSell) {
            $totalCost = $qtyToSell * $batch->cost_price; // 5 * 945 = 4725
            $totalProfit = $totalSellingPrice - $totalCost; // 6000 - 4725 = 1275

            // 4. Create Order Header
            $orderId = DB::table('sales_orders')->insertGetId([
                'invoice_no' => 'INV-1001',
                'customer_id' => $customerId,
                'channel' => 'pos',
                'status' => 'delivered',
                'payment_status' => 'paid',
                'sub_total' => $totalSellingPrice,
                'total_amount' => $totalSellingPrice,
                'paid_amount' => $totalSellingPrice,
                'total_profit' => $totalProfit,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 5. Create Order Item
            $itemId = DB::table('sales_order_items')->insertGetId([
                'sales_order_id' => $orderId,
                'product_variant_id' => $variant->id,
                'quantity' => $qtyToSell,
                'unit_price' => $sellingPrice,
                'total_price' => $totalSellingPrice,
                'total_cost' => $totalCost, // Locked in cost
                'created_at' => now(),
            ]);

            // 6. Deduct Stock from Batch (Update DB)
            DB::table('inventory_batches')->where('id', $batch->id)->decrement('remaining_qty', $qtyToSell);

            // 7. Allocation Log
            DB::table('sales_item_allocations')->insert([
                'sales_order_item_id' => $itemId,
                'inventory_batch_id' => $batch->id,
                'qty_deducted' => $qtyToSell,
                'cost_per_unit' => $batch->cost_price,
                'created_at' => now(),
            ]);

            // 8. Ledger Entry (Stock Out)
            DB::table('stock_ledgers')->insert([
                'product_variant_id' => $variant->id,
                'warehouse_id' => $batch->warehouse_id,
                'inventory_batch_id' => $batch->id,
                'type' => 'sale_out',
                'qty_change' => -$qtyToSell, // Negative
                'reference_type' => 'App\Models\SalesOrder',
                'reference_id' => $orderId,
                'date' => now(),
                'created_at' => now(),
            ]);
        }
    }
}