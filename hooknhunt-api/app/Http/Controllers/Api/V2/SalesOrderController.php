<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\ProductVariant;
use App\Models\Customer;
use App\Models\InventoryBatch; // Added for Stock Logic
use App\Models\Setting;
use App\Services\LoyaltyService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesOrderController extends Controller
{
    use ApiResponse;

    protected $loyaltyService;

    public function __construct(LoyaltyService $loyaltyService)
    {
        $this->loyaltyService = $loyaltyService;
    }

    /**
     * Calculate Cart Total (Dry Run)
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'channel' => 'required|in:pos,retail_web,wholesale_web,daraz',
            'items' => 'required|array',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_amount' => 'nullable|numeric|min:0'
        ]);

        try {
            $totals = $this->performCalculations($request->items, $request->channel, $request->discount_amount);
            return $this->sendSuccess($totals, 'Calculation successful');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Create New Sales Order (Final Checkout)
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'channel' => 'required|in:pos,retail_web,wholesale_web,daraz',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount_amount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_method' => 'required|in:cash,bank,bkash,card',
            'note' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // 1. Calculate Prices, Validate MOQ & Prepare Data
            $totals = $this->performCalculations($request->items, $request->channel, $request->discount_amount);
            
            // 2. Payment Status Logic
            $paidAmount = $request->paid_amount ?? 0;
            $dueAmount = max(0, $totals['total_amount'] - $paidAmount);
            
            $paymentStatus = 'unpaid';
            if ($paidAmount >= $totals['total_amount']) $paymentStatus = 'paid';
            elseif ($paidAmount > 0) $paymentStatus = 'partial';

            // 3. Order Status Logic (POS orders are delivered immediately)
            $orderStatus = ($request->channel === 'pos') ? 'delivered' : 'pending';

            // 4. Create Order Header
            $order = SalesOrder::create([
                'invoice_no' => 'INV-' . strtoupper(uniqid()), // To be replaced with auto-sequence
                'customer_id' => $request->customer_id,
                'sold_by' => auth()->id() ?? 1,
                'channel' => $request->channel,
                'status' => $orderStatus,
                'payment_status' => $paymentStatus,
                'sub_total' => $totals['sub_total'],
                'discount_amount' => $totals['discount_amount'],
                'total_amount' => $totals['total_amount'],
                'paid_amount' => $paidAmount,
                'due_amount' => $dueAmount,
                'note' => $request->note
            ]);

            // 5. Save Items & Deduct Stock (FIFO)
            foreach ($totals['items_data'] as $itemData) {
                
                // 🔥 STOCK DEDUCTION LOGIC HERE
                // This function calculates exact Cost of Goods Sold based on FIFO batches
                $calculatedCost = $this->deductStock($itemData['product_variant_id'], $itemData['quantity']);

                SalesOrderItem::create([
                    'sales_order_id' => $order->id,
                    'product_variant_id' => $itemData['product_variant_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $itemData['total_price'],
                    'total_cost' => $calculatedCost // Now saving real cost from batches
                ]);
            }

            // 6. Award Loyalty Points (Only if Delivered/POS)
            if ($order->status === 'delivered') {
                $this->loyaltyService->awardPoints($order);
            }

            DB::commit();
            return $this->sendSuccess($order->load('items'), 'Sales Order Created Successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Helper: FIFO Stock Deduction
     * Returns total cost (COGS) for the sold quantity
     */
    private function deductStock($variantId, $qtyNeeded)
    {
        $totalCost = 0;
        $remainingNeeded = $qtyNeeded;

        // 1. Get Batches for this Variant (FIFO: Oldest First)
        // Must strictly verify product_variant_id to ensure we don't take from Unsorted stock
        $batches = InventoryBatch::where('product_variant_id', $variantId)
            ->where('remaining_qty', '>', 0)
            ->orderBy('created_at', 'asc') // First In, First Out
            ->orderBy('id', 'asc')
            ->lockForUpdate() // Prevent race conditions
            ->get();

        // 2. Loop through batches
        foreach ($batches as $batch) {
            if ($remainingNeeded <= 0) break;

            $take = min($remainingNeeded, $batch->remaining_qty);

            // Update Batch
            $batch->remaining_qty -= $take;
            $batch->save();

            // Calculate Cost for these items
            $totalCost += ($take * $batch->cost_price);
            
            $remainingNeeded -= $take;
        }

        // 3. Check if we had enough stock
        if ($remainingNeeded > 0) {
            $variant = ProductVariant::with('product')->find($variantId);
            throw new \Exception("Insufficient sorted stock for '{$variant->full_name}'. Needed {$qtyNeeded}, but only found available batches for partial amount. Please sort more stock.");
        }

        return $totalCost;
    }

    /**
     * Helper: Centralized Calculation Logic
     */
    private function performCalculations($items, $channel, $discount = 0)
    {
        $subTotal = 0;
        $orderItemsData = [];

        $globalWholesaleMOQ = 10; 
        if ($channel === 'wholesale_web') {
            $setting = Setting::where('key', 'global_wholesale_moq')->first();
            if ($setting) $globalWholesaleMOQ = (int) $setting->value;
        }

        foreach ($items as $item) {
            $variant = ProductVariant::with('product')->findOrFail($item['variant_id']);

            // Wholesale MOQ Check
            if ($channel === 'wholesale_web') {
                $requiredQty = $variant->wholesale_moq ?? $globalWholesaleMOQ;
                if ($item['quantity'] < $requiredQty) {
                    throw new \Exception("Minimum order quantity for '{$variant->full_name}' is {$requiredQty} pieces (Wholesale Rule).");
                }
            }

            // Price Fetching
            $unitPrice = $variant->getPriceForChannel($channel);
            $lineTotal = $unitPrice * $item['quantity'];
            $subTotal += $lineTotal;

            $orderItemsData[] = [
                'product_variant_id' => $variant->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $lineTotal
            ];
        }

        $discount = $discount ?? 0;
        $totalAmount = max(0, $subTotal - $discount);

        return [
            'sub_total' => $subTotal,
            'discount_amount' => $discount,
            'total_amount' => $totalAmount,
            'items_data' => $orderItemsData
        ];
    }
}