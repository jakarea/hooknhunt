<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\ProductVariant;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of purchase orders.
     */
    public function index()
    {
        $orders = PurchaseOrder::with(['supplier', 'items.productVariant'])
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    /**
     * Store a newly created purchase order (Draft).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.china_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        try {
            DB::beginTransaction();

            // Create purchase order with draft status
            $order = PurchaseOrder::create([
                'supplier_id' => $request->supplier_id,
                'status' => 'draft',
                'created_by' => auth()->id(),
            ]);

            // Create purchase order items
            foreach ($request->items as $itemData) {
                PurchaseOrderItem::create([
                    'po_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'product_variant_id' => $itemData['product_variant_id'] ?? null,
                    'china_price' => $itemData['china_price'],
                    'quantity' => $itemData['quantity'],
                ]);
            }

            DB::commit();

            // Load order with relationships for response
            $order->load(['supplier', 'items.product', 'items.productVariant']);

            return response()->json($order, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified purchase order.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'items.product', 'items.productVariant']);

        return response()->json($purchaseOrder);
    }

    /**
     * Update the status of a purchase order (The Workflow Engine).
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:draft,payment_confirmed,supplier_dispatched,shipped_bd,arrived_bd,in_transit_bogura,received_hub,completed,lost',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $newStatus = $request->status;

        // Validate status transition
        if (!$purchaseOrder->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => "Invalid status transition from {$purchaseOrder->status} to {$newStatus}"
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Update status and workflow-specific fields
            $purchaseOrder->status = $newStatus;

            switch ($newStatus) {
                case 'payment_confirmed':
                    // Validate and save exchange rate
                    $request->validate([
                        'exchange_rate' => 'required|numeric|min:0'
                    ]);

                    $purchaseOrder->exchange_rate = $request->exchange_rate;
                    $purchaseOrder->order_number = PurchaseOrder::generateOrderNumber();
                    break;

                case 'supplier_dispatched':
                    // Validate and save courier info
                    $request->validate([
                        'courier_name' => 'required|string|max:255',
                        'tracking_number' => 'required|string|max:255'
                    ]);

                    $purchaseOrder->courier_name = $request->courier_name;
                    $purchaseOrder->tracking_number = $request->tracking_number;
                    break;

                case 'shipped_bd':
                    // Validate and save lot number
                    $request->validate([
                        'lot_number' => 'required|string|max:255'
                    ]);

                    $purchaseOrder->lot_number = $request->lot_number;
                    break;

                case 'arrived_bd':
                    // Optional: Update shipping costs for items
                    if ($request->has('items')) {
                        $this->updateItemShippingCosts($purchaseOrder, $request->items);
                    }
                    break;

                case 'in_transit_bogura':
                    // Validate and save BD courier tracking
                    $request->validate([
                        'bd_courier_tracking' => 'required|string|max:255'
                    ]);

                    $purchaseOrder->bd_courier_tracking = $request->bd_courier_tracking;
                    break;

                case 'received_hub':
                    // Validate and save final metrics
                    $request->validate([
                        'total_weight' => 'required|numeric|min:0',
                        'extra_cost_global' => 'nullable|numeric|min:0'
                    ]);

                    $purchaseOrder->total_weight = $request->total_weight;
                    $purchaseOrder->extra_cost_global = $request->extra_cost_global ?? 0;

                    // Optional: Update lost quantities
                    if ($request->has('items')) {
                        $this->updateLostQuantities($purchaseOrder, $request->items);
                    }
                    break;

                case 'completed':
                    // Trigger landed cost calculation
                    $this->calculateAndFinalize($purchaseOrder);
                    break;

                case 'lost':
                    // Just mark as lost, no special handling needed
                    break;
            }

            $purchaseOrder->save();
            DB::commit();

            // Reload with relationships for response
            $purchaseOrder->load(['supplier', 'items.product', 'items.productVariant']);

            return response()->json($purchaseOrder);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update purchase order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update shipping costs for items.
     */
    private function updateItemShippingCosts(PurchaseOrder $order, array $itemsData)
    {
        foreach ($itemsData as $itemData) {
            if (!isset($itemData['id'])) {
                continue;
            }

            $item = $order->items()->find($itemData['id']);
            if ($item && isset($itemData['shipping_cost'])) {
                $item->shipping_cost = $itemData['shipping_cost'];
                $item->save();
            }
        }
    }

    /**
     * Update lost quantities for items.
     */
    private function updateLostQuantities(PurchaseOrder $order, array $itemsData)
    {
        foreach ($itemsData as $itemData) {
            if (!isset($itemData['id'])) {
                continue;
            }

            $item = $order->items()->find($itemData['id']);
            if ($item && isset($itemData['lost_quantity'])) {
                $item->lost_quantity = $itemData['lost_quantity'];
                $item->save();
            }
        }
    }

    /**
     * Calculate and finalize landed costs when order is completed.
     */
    private function calculateAndFinalize(PurchaseOrder $order)
    {
        // Load order with items to ensure we have the latest data
        $order->load('items');

        foreach ($order->items as $item) {
            // 1. Base Cost (BDT): china_price * exchange_rate
            $baseCost = $item->china_price * $order->exchange_rate;

            // 2. Add shipping cost
            $shippingCost = $item->shipping_cost * $item->quantity;

            // 3. Distribute Global Extra Cost
            $extraCostPerUnit = ($order->extra_cost_global ?? 0) / $order->total_quantity;
            $distributedExtraCost = $extraCostPerUnit * $item->quantity;

            // 4. Effective quantity after losses
            $effectiveQty = $item->quantity - $item->lost_quantity;

            if ($effectiveQty > 0) {
                // 5. Calculate total line cost (including loss distribution)
                $totalLineCost = ($item->quantity * $baseCost) + ($item->quantity * $item->shipping_cost) + $distributedExtraCost;

                // 6. Final landed cost per effective unit (loss value distributed to remaining items)
                $finalLandedCost = $totalLineCost / $effectiveQty;

                // 7. Update final_unit_cost in purchase_order_items
                $item->final_unit_cost = $finalLandedCost;
                $item->save();

                // 8. Update product_variants -> landed_cost
                if ($item->productVariant) {
                    $item->productVariant->landed_cost = $finalLandedCost;
                    $item->productVariant->save();
                }

                // 9. Update inventory -> increment quantity
                $inventory = Inventory::where('product_variant_id', $item->product_variant_id)->first();
                if ($inventory) {
                    $inventory->quantity += $effectiveQty;
                    $inventory->save();
                }
            }
        }
    }

    /**
     * Receive items and finalize the purchase order.
     *
     * This method handles the critical workflow step where Parent Products
     * are split into Variants, landed costs are calculated, and inventory is updated.
     */
    public function receiveItems(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validator = Validator::make($request->all(), [
            'extra_cost_global' => 'nullable|numeric|min:0',
            'total_weight' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.po_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.shipping_cost' => 'required|numeric|min:0',
            'items.*.lost_quantity' => 'required|integer|min:0',
            'items.*.received_variants' => 'required|array|min:1',
            'items.*.received_variants.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.received_variants.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validate that order can be received
        if (!$purchaseOrder->canTransitionTo('received_hub')) {
            return response()->json([
                'message' => "Order cannot be received in current status: {$purchaseOrder->status}"
            ], 422);
        }

        // Validate exchange rate exists
        if (!$purchaseOrder->exchange_rate) {
            return response()->json([
                'message' => 'Exchange rate must be set before receiving items'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Update order with global data
            $purchaseOrder->extra_cost_global = $request->extra_cost_global ?? 0;
            $purchaseOrder->total_weight = $request->total_weight;
            $purchaseOrder->status = 'received_hub';

            // Get total quantity for extra cost distribution
            $totalOrderQuantity = $purchaseOrder->total_quantity;
            $extraCostPerUnit = $totalOrderQuantity > 0
                ? ($purchaseOrder->extra_cost_global ?? 0) / $totalOrderQuantity
                : 0;

            // Process each item
            foreach ($request->items as $itemData) {
                // Get the draft purchase order item
                $poItem = PurchaseOrderItem::findOrFail($itemData['po_item_id']);

                // Validate this item belongs to the current order
                if ($poItem->po_id !== $purchaseOrder->id) {
                    throw new \Exception("Item {$itemData['po_item_id']} does not belong to this purchase order");
                }

                // Update item with shipping and loss data
                $poItem->shipping_cost = $itemData['shipping_cost'];
                $poItem->lost_quantity = $itemData['lost_quantity'];

                // 1. Get Draft Data (already have from $poItem)
                $originalQuantity = $poItem->quantity;
                $chinaPrice = $poItem->china_price;
                $exchangeRate = $purchaseOrder->exchange_rate;

                // 2. Calculate Base Cost (BDT): china_price * exchange_rate * quantity
                $baseCostBdt = $chinaPrice * $exchangeRate * $originalQuantity;

                // 3. Add Costs: shipping_cost + allocated portion of extra_cost_global
                $shippingCost = $itemData['shipping_cost'];
                $allocatedExtraCost = $extraCostPerUnit * $originalQuantity;
                $totalLineCost = $baseCostBdt + $shippingCost + $allocatedExtraCost;

                // 4. Effective Qty: quantity - lost_quantity
                $effectiveQuantity = $originalQuantity - $itemData['lost_quantity'];

                if ($effectiveQuantity > 0) {
                    // 5. Calculate Unit Cost (Landed): Total Line Cost / Effective Qty
                    $landedCostPerUnit = $totalLineCost / $effectiveQuantity;

                    // Update the PO item with final landed cost
                    $poItem->final_unit_cost = $landedCostPerUnit;
                    $poItem->save();

                    // 6. Update Variants & Inventory
                    $totalReceivedQuantity = 0;
                    foreach ($itemData['received_variants'] as $variantData) {
                        $variantId = $variantData['variant_id'];
                        $variantQuantity = $variantData['quantity'];
                        $totalReceivedQuantity += $variantQuantity;

                        // Update landed cost in product_variants table
                        $productVariant = ProductVariant::find($variantId);
                        if ($productVariant) {
                            $productVariant->landed_cost = $landedCostPerUnit;
                            $productVariant->save();
                        }

                        // Update or create inventory record
                        $inventory = Inventory::where('product_variant_id', $variantId)->first();
                        if (!$inventory) {
                            $inventory = Inventory::create([
                                'product_variant_id' => $variantId,
                                'quantity' => 0,
                                'reserved_quantity' => 0,
                                'available_quantity' => 0,
                                'low_stock_threshold' => 10, // Default threshold
                                'last_updated_at' => now(),
                            ]);
                        }

                        // Increment inventory quantity
                        $inventory->addStock($variantQuantity);
                    }

                    // Validate that received quantities match effective quantity
                    if ($totalReceivedQuantity !== $effectiveQuantity) {
                        throw new \Exception("Received quantities ({$totalReceivedQuantity}) do not match effective quantity ({$effectiveQuantity}) for item {$poItem->id}");
                    }
                } else {
                    // All items lost, still update final cost as 0
                    $poItem->final_unit_cost = 0;
                    $poItem->save();
                }
            }

            $purchaseOrder->save();
            DB::commit();

            // Load order with relationships for response
            $purchaseOrder->load(['supplier', 'items.product', 'items.productVariant']);

            return response()->json($purchaseOrder);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to receive items',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
