<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\ProductVariant;
use App\Models\Inventory;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of purchase orders.
     */
    public function index(Request $request)
    {
        // Add debugging
        \Log::info('PurchaseOrderController::index called');
        \Log::info('Current user:', ['user' => auth()->user()]);
        \Log::info('User role:', ['role' => auth()->user()?->role]);

        $query = PurchaseOrder::with(['supplier', 'items.product', 'items.productVariant']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter for completed or partially completed orders
        if ($request->status === 'completed') {
            $query->whereIn('status', ['completed', 'completed_partially']);
        }

        $orders = $query->latest()->paginate(15);

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

            // Get default exchange rate from settings
            $defaultExchangeRate = Setting::where('key', 'exchange_rate_rmb_bdt')->value('value') ?? 17.50;

            // Create purchase order with draft status
            $order = PurchaseOrder::create([
                'supplier_id' => $request->supplier_id,
                'status' => 'draft',
                'exchange_rate' => $defaultExchangeRate,
                'order_date' => now(),
                'expected_date' => now()->addWeeks(3), // Default 3 weeks from order date
                'created_by' => auth()->id(),
            ]);

            // Create purchase order items
            foreach ($request->items as $itemData) {
                PurchaseOrderItem::create([
                    'po_number' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'product_variant_id' => $itemData['product_variant_id'] ?? null,
                    'china_price' => $itemData['china_price'],
                    'quantity' => $itemData['quantity'],
                ]);
            }

            // Calculate unit_price, total_price, and final_unit_cost with current exchange rate
            $this->updateFinalUnitCosts($order);
            // Calculate and update total_amount (China price total in RMB)
            $this->updateTotalAmount($order);

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
     * Update the specified purchase order items.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Add debugging
        \Log::info('PurchaseOrderController::update called');
        \Log::info('Purchase Order ID:', ['id' => $purchaseOrder->id]);
        \Log::info('Request data:', $request->all());

        // Check if this is an order field update (like exchange_rate) or items update
        if (isset($request->exchange_rate) || isset($request->courier_name) || isset($request->tracking_number) || isset($request->lot_number) || isset($request->shipping_method) || isset($request->shipping_cost) || isset($request->bd_courier_tracking) || isset($request->total_weight) || isset($request->extra_cost_global)) {
            // This is an order field update, not items update
            return $this->updateOrderFields($request, $purchaseOrder);
        }

        $inputData = $request->all();
        \Log::info('Raw request input:', $inputData);
        \Log::info('Request content type:', ['content_type' => $request->header('Content-Type')]);
        \Log::info('Request is JSON:', ['is_json' => $request->isJson()]);

        // Debug the exact structure of the request data
        if (isset($inputData['items'])) {
            \Log::info('Items found in request, type:', ['type' => gettype($inputData['items'])]);
            if (is_array($inputData['items'])) {
                \Log::info('Items is array, count:', ['count' => count($inputData['items'])]);
                foreach ($inputData['items'] as $index => $item) {
                    \Log::info("Item $index structure:", [
                        'type' => gettype($item),
                        'keys' => is_array($item) ? array_keys($item) : 'not_array',
                        'content' => $item
                    ]);
                }
            }
        }

        // Ensure items is an array
        if (!isset($inputData['items']) || !is_array($inputData['items'])) {
            \Log::error('Items validation failed:', ['items' => $inputData['items'] ?? 'not_set']);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['items' => ['Items field is required and must be an array']]
            ], 422);
        }

        // Manual validation to debug the issue
        $items = $inputData['items'] ?? [];
        \Log::info('Items array for validation:', ['items' => $items]);

        $validationErrors = [];
        $validatedItems = [];

        if (empty($items)) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['items' => ['At least one item is required']]
            ], 422);
        }

        foreach ($items as $index => $item) {
            // Check if this is a new item (null ID) or existing item
            if (!isset($item['id']) || is_null($item['id'])) {
                // New item - id is null/not set, but product_id is required
                if (!isset($item['product_id'])) {
                    $validationErrors["items.$index.product_id"] = 'Product ID is required for new items';
                    continue;
                }
            } else {
                // Existing item - validate ID
                if (!is_numeric($item['id']) || (int)$item['id'] <= 0) {
                    $validationErrors["items.$index.id"] = 'ID must be a positive integer or null for new items';
                    continue;
                }

                // Check if item exists in database for existing items
                $exists = PurchaseOrderItem::where('id', $item['id'])
                    ->where('po_number', $purchaseOrder->id)
                    ->exists();

                if (!$exists) {
                    $validationErrors["items.$index.id"] = "Item ID {$item['id']} does not exist for this purchase order";
                    continue;
                }
            }

            if (!isset($item['china_price'])) {
                $validationErrors["items.$index.china_price"] = 'China price is required';
                continue;
            }

            if (!is_numeric($item['china_price']) || (float)$item['china_price'] < 0) {
                $validationErrors["items.$index.china_price"] = 'China price must be a non-negative number';
                continue;
            }

            if (!isset($item['quantity'])) {
                $validationErrors["items.$index.quantity"] = 'Quantity is required';
                continue;
            }

            if (!is_numeric($item['quantity']) || (int)$item['quantity'] <= 0) {
                $validationErrors["items.$index.quantity"] = 'Quantity must be a positive integer';
                continue;
            }

            $validatedItems[] = [
                'id' => isset($item['id']) ? (int) $item['id'] : null,
                'product_id' => (int) $item['product_id'],
                'china_price' => (float) $item['china_price'],
                'quantity' => (int) $item['quantity'],
            ];
        }

        if (!empty($validationErrors)) {
            \Log::error('Manual validation failed:', ['validation_errors' => $validationErrors]);

            // Convert to Laravel format - each error key should map to an array of messages
            $laravelErrors = [];
            foreach ($validationErrors as $key => $message) {
                $laravelErrors[$key] = [$message];
            }

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $laravelErrors
            ], 422);
        }

        \Log::info('Manual validation passed. Validated items:', ['validated_items' => $validatedItems]);

        try {
            DB::beginTransaction();

            // Get all existing items for this purchase order
            $existingItemIds = PurchaseOrderItem::where('po_number', $purchaseOrder->id)
                ->pluck('id')
                ->toArray();

            // Get IDs of items that should be kept (submitted items with valid IDs)
            $submittedItemIds = collect($validatedItems)
                ->filter(fn($item) => $item['id'] !== null)
                ->map(fn($item) => $item['id'])
                ->toArray();

            // Find items to delete (existing items not in submitted list)
            $itemsToDelete = array_diff($existingItemIds, $submittedItemIds);

            // Delete unchecked items
            foreach ($itemsToDelete as $itemIdToDelete) {
                PurchaseOrderItem::where('id', $itemIdToDelete)->delete();
                \Log::info('Deleted purchase order item:', ['item_id' => $itemIdToDelete]);
            }

            // Process submitted items (update existing or create new)
            foreach ($validatedItems as $itemData) {
                if ($itemData['id'] === null) {
                    // Create new item
                    \Log::info('Creating new purchase order item:', [
                        'product_id' => $itemData['product_id'],
                        'china_price' => $itemData['china_price'],
                        'quantity' => $itemData['quantity']
                    ]);

                    PurchaseOrderItem::create([
                        'po_number' => $purchaseOrder->id,
                        'product_id' => $itemData['product_id'],
                        'china_price' => $itemData['china_price'],
                        'quantity' => $itemData['quantity'],
                    ]);
                } else {
                    // Update existing item
                    $purchaseOrderItem = PurchaseOrderItem::where('id', $itemData['id'])
                        ->where('po_number', $purchaseOrder->id)
                        ->first();

                    if ($purchaseOrderItem) {
                        $purchaseOrderItem->update([
                            'china_price' => $itemData['china_price'],
                            'quantity' => $itemData['quantity'],
                        ]);

                        \Log::info('Updated purchase order item:', [
                            'item_id' => $purchaseOrderItem->id,
                            'china_price' => $itemData['china_price'],
                            'quantity' => $itemData['quantity']
                        ]);
                    } else {
                        \Log::warning('Purchase order item not found for update:', ['id' => $itemData['id']]);
                    }
                }
            }

            // Recalculate total amount if needed
            $totalChinaPrice = $purchaseOrder->items()->sum(DB::raw('china_price * quantity'));
            $purchaseOrder->update([
                'total_amount' => $totalChinaPrice * ($purchaseOrder->exchange_rate ?? 1),
            ]);

            DB::commit();

            \Log::info('Purchase order updated successfully', ['purchase_order_id' => $purchaseOrder->id]);

            // Reload the purchase order with updated items
            $purchaseOrder->load(['supplier', 'items.product', 'items.productVariant']);

            return response()->json([
                'message' => 'Purchase order updated successfully',
                'purchase_order' => $purchaseOrder
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('PurchaseOrderController::update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a purchase order (The Workflow Engine).
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:draft,payment_confirmed,supplier_dispatched,warehouse_received,shipped_bd,arrived_bd,in_transit_bogura,received_hub,completed,completed_partially,lost',
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
                    $purchaseOrder->po_number = $purchaseOrder->generateOrderNumber();
                    // Recalculate total amount with updated exchange rate
                    $this->updateTotalAmount($purchaseOrder);
                    break;

                case 'supplier_dispatched':
                    // Validate and save courier info (optional fields)
                    $request->validate([
                        'courier_name' => 'nullable|string|max:255',
                        'tracking_number' => 'nullable|string|max:255'
                    ]);

                    $purchaseOrder->courier_name = $request->courier_name;
                    $purchaseOrder->tracking_number = $request->tracking_number;
                    break;

                case 'warehouse_received':
                    // No input required, just status change
                    break;

                case 'shipped_bd':
                    // Validate and save lot number (optional field)
                    $request->validate([
                        'lot_number' => 'nullable|string|max:255'
                    ]);

                    $purchaseOrder->lot_number = $request->lot_number;
                    break;

                case 'arrived_bd':
                    // Validate and save shipping method and cost (optional fields)
                    $request->validate([
                        'shipping_method' => 'nullable|string|in:air,sea',
                        'shipping_cost' => 'nullable|numeric|min:0'
                    ]);

                    $purchaseOrder->shipping_method = $request->shipping_method;
                    $purchaseOrder->shipping_cost = $request->shipping_cost;
                    // Recalculate total amount with updated shipping cost
                    $this->updateTotalAmount($purchaseOrder);
                    break;

                case 'in_transit_bogura':
                    // Validate and save BD courier tracking (optional field)
                    $request->validate([
                        'bd_courier_tracking' => 'nullable|string|max:255'
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

                    // Optional: Update received quantities
                    if ($request->has('items')) {
                        $this->updateReceivedQuantities($purchaseOrder, $request->items);
                    }
                    // Recalculate total amount with updated extra cost
                    $this->updateTotalAmount($purchaseOrder);
                    break;

                case 'completed':
                    // Check if there are any lost items (received < quantity)
                    $hasLostItems = $purchaseOrder->items->contains(function ($item) {
                        return $item->received_quantity < $item->quantity;
                    });

                    if ($hasLostItems) {
                        // Override to completed_partially if items were lost
                        $newStatus = 'completed_partially';
                        $purchaseOrder->status = $newStatus;
                    }

                    // Trigger landed cost calculation
                    $this->calculateAndFinalize($purchaseOrder);
                    // Ensure total amount reflects final values
                    $this->updateTotalAmount($purchaseOrder);
                    break;

                case 'completed_partially':
                    // Trigger landed cost calculation for partial completion
                    $this->calculateAndFinalize($purchaseOrder);
                    // Ensure total amount reflects final values
                    $this->updateTotalAmount($purchaseOrder);
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
     * Update received quantities for items.
     */
    private function updateReceivedQuantities(PurchaseOrder $order, array $itemsData)
    {
        foreach ($itemsData as $itemData) {
            if (!isset($itemData['id'])) {
                continue;
            }

            $item = $order->items()->find($itemData['id']);
            if ($item && isset($itemData['received_quantity'])) {
                $item->received_quantity = $itemData['received_quantity'];
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

        // 1. Normalize received_quantity (if null, assume = quantity)
        foreach ($order->items as $item) {
            if ($item->received_quantity === null) {
                $item->received_quantity = $item->quantity;
                $item->save();
            }
        }

        // 2. Calculate total received quantity for distributing shipping and extra costs
        // We use received quantity because shipping/extra costs are typically associated with the physical goods received
        $totalReceivedQty = (int) $order->items->sum('received_quantity');
        
        $orderShippingCost = (float) ($order->shipping_cost ?? 0);
        $orderExtraCost = (float) ($order->extra_cost_global ?? 0);
        
        // Distribute shipping + extra cost per RECEIVED unit
        $overheadPerUnit = $totalReceivedQty > 0
            ? ($orderShippingCost + $orderExtraCost) / $totalReceivedQty
            : 0.0;

        foreach ($order->items as $item) {
            $quantity = (int) $item->quantity;
            $receivedQty = (int) $item->received_quantity;
            
            $effectiveQty = $receivedQty;
            
            // Skip if nothing received
            if ($effectiveQty <= 0) {
                $item->unit_price = 0;
                $item->total_price = 0;
                $item->final_unit_cost = 0;
                $item->save();
                continue;
            }

            // Calculate unit_price: china_price * exchange_rate (base price in BDT)
            $unitPrice = (float) $item->china_price * (float) $order->exchange_rate;

            // 1. Total item cost in BDT (china_price * exchange_rate * quantity)
            // We pay for what we ordered (usually), so the product cost is fixed based on order quantity.
            $totalItemCost = $unitPrice * $quantity;

            // 2. Overhead for this line (shipping + extra cost allocated to received units)
            $lineOverhead = $overheadPerUnit * $effectiveQty;

            // 3. Total line cost including overhead
            $totalLineCost = $totalItemCost + $lineOverhead;

            // 4. Final unit cost = total line cost / effective quantity (received quantity)
            $finalLandedCost = $totalLineCost / $effectiveQty;

            // Update all price fields in purchase_order_items
            $item->unit_price = $unitPrice;
            $item->total_price = $totalItemCost;
            $item->final_unit_cost = $finalLandedCost;
            $item->save();

            // Update product_variants -> landed_cost
            if ($item->productVariant) {
                $item->productVariant->landed_cost = $finalLandedCost;
                $item->productVariant->save();
            }

            // Inventory update placeholder (when inventory table exists)
            // $inventory = Inventory::where('product_variant_id', $item->product_variant_id)->first();
            // if ($inventory) {
            //     $inventory->quantity += $effectiveQty;
            //     $inventory->save();
            // }
        }

        // After updating item costs, also refresh the order total amount
        $this->updateTotalAmount($order);
    }

    /**
     * Receive items at hub and update stock information.
     *
     * This method handles receiving stock with unit weight, extra weight, and lost quantities.
     * Calculates total weight automatically and determines if order is completed or partially completed.
     */
    public function receiveItems(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validator = Validator::make($request->all(), [
            'additional_cost' => 'nullable|numeric|min:0',
            'total_weight' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.po_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.unit_weight' => 'required|numeric|min:0',
            'items.*.extra_weight' => 'nullable|numeric|min:0',
            'items.*.received_quantity' => 'nullable|integer|min:0',
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

        try {
            DB::beginTransaction();

            // Update purchase order status to received_hub
            // The final completion status (completed or completed_partially) will be set via updateStatus endpoint
            $purchaseOrder->status = 'received_hub';
            $purchaseOrder->extra_cost_global = $request->additional_cost ?? 0;
            $purchaseOrder->total_weight = $request->total_weight;

            // Process each item
            foreach ($request->items as $itemData) {
                $poItem = PurchaseOrderItem::findOrFail($itemData['po_item_id']);

                // Validate this item belongs to the current order
                if ($poItem->po_number !== $purchaseOrder->id) {
                    throw new \Exception("Item {$itemData['po_item_id']} does not belong to this purchase order");
                }

                // Update item with receive stock data
                $poItem->unit_weight = $itemData['unit_weight'];
                $poItem->extra_weight = $itemData['extra_weight'] ?? 0;
                $poItem->received_quantity = $itemData['received_quantity'] ?? 0;
                $poItem->save();
            }

            $purchaseOrder->save();

            // Calculate final unit costs immediately after receiving stock
            $this->calculateAndFinalize($purchaseOrder);

            // Recalculate total amount considering updated extra cost
            $this->updateTotalAmount($purchaseOrder);

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

    /**
     * Update the total_amount field for the purchase order.
     * Total amount is calculated as the sum of (china_price * quantity) for all items.
     */
    private function updateTotalAmount(PurchaseOrder $order)
    {
        // Ensure items are available
        $order->loadMissing('items');

        $exchangeRate = (float) ($order->exchange_rate ?? 0);
        $itemsTotalBDT = $order->items->sum(function ($item) use ($exchangeRate) {
            return ((float) $item->china_price) * ((int) $item->quantity) * $exchangeRate;
        });

        $shipping = (float) ($order->shipping_cost ?? 0);
        $extra = (float) ($order->extra_cost_global ?? 0);

        $total = $itemsTotalBDT + $shipping + $extra;

        $order->total_amount = $total;
        $order->save();
    }

    /**
     * Update order fields without changing status.
     */
    private function updateOrderFields(Request $request, PurchaseOrder $purchaseOrder)
    {
        try {
            DB::beginTransaction();

            // Update allowed fields
            if ($request->has('exchange_rate')) {
                $purchaseOrder->exchange_rate = $request->exchange_rate;
                // Recalculate final unit costs with updated exchange rate
                $this->updateFinalUnitCosts($purchaseOrder);
                // Recalculate total amount with updated exchange rate
                $this->updateTotalAmount($purchaseOrder);
            }

            if ($request->has('courier_name')) {
                $purchaseOrder->courier_name = $request->courier_name;
            }

            if ($request->has('tracking_number')) {
                $purchaseOrder->tracking_number = $request->tracking_number;
            }

            if ($request->has('lot_number')) {
                $purchaseOrder->lot_number = $request->lot_number;
            }

            if ($request->has('shipping_method')) {
                $purchaseOrder->shipping_method = $request->shipping_method;
            }

            if ($request->has('shipping_cost')) {
                $purchaseOrder->shipping_cost = $request->shipping_cost;
                // Recalculate total amount
                $this->updateTotalAmount($purchaseOrder);
            }

            if ($request->has('bd_courier_tracking')) {
                $purchaseOrder->bd_courier_tracking = $request->bd_courier_tracking;
            }

            if ($request->has('total_weight')) {
                $purchaseOrder->total_weight = $request->total_weight;
            }

            if ($request->has('extra_cost_global')) {
                $purchaseOrder->extra_cost_global = $request->extra_cost_global;
                // Recalculate total amount
                $this->updateTotalAmount($purchaseOrder);
            }

            // Update purchase order items if provided
            if ($request->has('items')) {
                $items = $request->input('items');
                \Log::info('Processing items update in updateOrderFields', ['items_count' => count($items)]);

                // Log what items actually belong to this purchase order
                // Try both numeric and string format for po_number
                $existingItems = PurchaseOrderItem::where('po_number', $purchaseOrder->id)
                                              ->orWhere('po_number', $purchaseOrder->po_number)
                                              ->get();
                \Log::info('Existing items for this purchase order', [
                    'purchase_order_id' => $purchaseOrder->id,
                    'po_number' => $purchaseOrder->po_number,
                    'existing_item_ids' => $existingItems->pluck('id')->toArray(),
                    'existing_items_count' => $existingItems->count(),
                    'manual_query_numeric' => "SELECT id, po_number, product_id, received_quantity FROM purchase_order_items WHERE po_number = {$purchaseOrder->id}",
                    'manual_query_string' => "SELECT id, po_number, product_id, received_quantity FROM purchase_order_items WHERE po_number = '{$purchaseOrder->po_number}'"
                ]);

                foreach ($items as $itemData) {
                    \Log::info('Processing item data', ['item_data' => $itemData]);

                    if (isset($itemData['id'])) {
                        $purchaseOrderItem = PurchaseOrderItem::find($itemData['id']);

                        if ($purchaseOrderItem && ($purchaseOrderItem->po_number === $purchaseOrder->id || $purchaseOrderItem->po_number === $purchaseOrder->po_number)) {
                            \Log::info('Found purchase order item to update', [
                                'item_id' => $purchaseOrderItem->id,
                                'current_received_quantity' => $purchaseOrderItem->received_quantity,
                                'new_received_quantity' => $itemData['received_quantity'] ?? 'not_set'
                            ]);

                            // Update allowed fields for purchase order items
                            if (isset($itemData['unit_weight'])) {
                                $purchaseOrderItem->unit_weight = $itemData['unit_weight'];
                            }

                            if (isset($itemData['extra_weight'])) {
                                $purchaseOrderItem->extra_weight = $itemData['extra_weight'];
                            }

                            $updateQueries = [];
                            if (isset($itemData['unit_weight'])) {
                                $purchaseOrderItem->unit_weight = $itemData['unit_weight'];
                                $updateQueries[] = "unit_weight = {$itemData['unit_weight']}";
                            }

                            if (isset($itemData['extra_weight'])) {
                                $purchaseOrderItem->extra_weight = $itemData['extra_weight'];
                                $updateQueries[] = "extra_weight = {$itemData['extra_weight']}";
                            }

                            if (isset($itemData['received_quantity'])) {
                                $purchaseOrderItem->received_quantity = $itemData['received_quantity'];
                                $updateQueries[] = "received_quantity = {$itemData['received_quantity']}";
                                \Log::info('Updated received_quantity', [
                                    'item_id' => $purchaseOrderItem->id,
                                    'old_value' => $purchaseOrderItem->getOriginal('received_quantity'),
                                    'new_value' => $itemData['received_quantity']
                                ]);
                            }

                            if (isset($itemData['final_unit_cost'])) {
                                $purchaseOrderItem->final_unit_cost = $itemData['final_unit_cost'];
                                $updateQueries[] = "final_unit_cost = {$itemData['final_unit_cost']}";
                            }

                            // Log the manual update query that would be executed
                            if (!empty($updateQueries)) {
                                $manualUpdateQuery = "UPDATE purchase_order_items SET " . implode(', ', $updateQueries) . " WHERE id = {$itemData['id']} AND po_number = '{$purchaseOrder->po_number}'";
                                \Log::info('Manual update query for item', [
                                    'item_id' => $itemData['id'],
                                    'manual_query' => $manualUpdateQuery
                                ]);
                            }

                            $purchaseOrderItem->save();

                            \Log::info('Purchase order item updated successfully', [
                                'item_id' => $purchaseOrderItem->id,
                                'unit_weight' => $purchaseOrderItem->unit_weight,
                                'extra_weight' => $purchaseOrderItem->extra_weight,
                                'received_quantity' => $purchaseOrderItem->received_quantity
                            ]);
                        } else {
                            \Log::warning('Purchase order item not found or wrong order', [
                                'item_id' => $itemData['id'],
                                'purchase_order_id' => $purchaseOrder->id,
                                'po_number' => $purchaseOrder->po_number,
                                'item_found' => $purchaseOrderItem ? 'yes' : 'no',
                                'item_po_number' => $purchaseOrderItem ? $purchaseOrderItem->po_number : 'N/A'
                            ]);
                        }
                    }
                }
            } else {
                \Log::info('No items found in request for updateOrderFields');
            }

            $purchaseOrder->save();

            DB::commit();

            \Log::info('Purchase order fields updated successfully', ['purchase_order_id' => $purchaseOrder->id]);

            // Load order with relationships for response
            $purchaseOrder->load(['supplier', 'items.product', 'items.productVariant']);

            return response()->json($purchaseOrder);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update purchase order fields:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific purchase order item with its product details.
     */
    public function getItem($id)
    {
        $purchaseOrderItem = PurchaseOrderItem::findOrFail($id);
        $purchaseOrderItem->load(['product', 'purchaseOrder.supplier']);

        return response()->json($purchaseOrderItem);
    }

    /**
     * Receive stock for a purchase order item (simplified version for UI).
     */
    public function receiveStock(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'po_item_id' => 'required|exists:purchase_order_items,id',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'required|string|max:255|unique:product_variants,sku',
            'variants.*.variant_name' => 'required|string|max:255',
            'variants.*.quantity' => 'required|integer|min:1',
            'variants.*.landed_cost' => 'required|numeric|min:0',
            'variants.*.retail_price' => 'nullable|numeric|min:0',
            'variants.*.wholesale_price' => 'nullable|numeric|min:0',
            'variants.*.daraz_price' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Additional validation: Check for duplicate SKUs within the request itself
        $skus = collect($request->variants)->pluck('sku');
        $duplicateSkus = $skus->duplicates();

        if ($duplicateSkus->isNotEmpty()) {
            return response()->json([
                'message' => 'Duplicate SKUs found in this request',
                'errors' => [
                    'variants' => ['The following SKUs are duplicated: ' . $duplicateSkus->implode(', ') . '. Each SKU must be unique within the request.']
                ]
            ], 422);
        }

        try {
            DB::beginTransaction();

            $poItem = PurchaseOrderItem::findOrFail($request->po_item_id);

            // Create product variants and inventory records
            $totalQuantity = 0;
            foreach ($request->variants as $variantData) {
                // Create product variant
                $productVariant = ProductVariant::create([
                    'product_id' => $poItem->product_id,
                    'sku' => $variantData['sku'],
                    'retail_name' => $variantData['retail_name'] ?? $variantData['variant_name'],
                    'wholesale_name' => $variantData['wholesale_name'] ?? $variantData['variant_name'],
                    'daraz_name' => $variantData['daraz_name'] ?? $variantData['variant_name'],
                    'landed_cost' => $variantData['landed_cost'],
                    'retail_price' => $variantData['retail_price'] ?? 0,
                    'wholesale_price' => $variantData['wholesale_price'] ?? 0,
                    'daraz_price' => $variantData['daraz_price'] ?? 0,
                    'status' => 'active',
                ]);

                // Create inventory record
                Inventory::create([
                    'product_variant_id' => $productVariant->id,
                    'quantity' => $variantData['quantity'],
                    'reserved_quantity' => 0,
                    'min_stock_level' => 10, // Default threshold
                ]);

                $totalQuantity += $variantData['quantity'];
            }

            // Update PO item
            // NOTE: received_quantity should only be updated via receiveItems (warehouse receiving)
            // stocked_quantity should be updated via receiveStock (inventory creation)
            $poItem->stocked_quantity = ($poItem->stocked_quantity ?? 0) + $totalQuantity;
            $poItem->final_unit_cost = collect($request->variants)->avg('landed_cost');
            $poItem->save();

            // Update product status if needed
            $product = $poItem->product;
            if ($product && $product->status === 'draft') {
                $product->status = 'published';
                $product->save();
            }

            // Check if purchase order should be marked as completed
            $purchaseOrder = $poItem->purchaseOrder;
            $allItems = $purchaseOrder->items;
            $allReceived = $allItems->every(function ($item) {
                return $item->received_quantity >= $item->quantity;
            });

            if ($allReceived) {
                $purchaseOrder->status = 'completed';
                $purchaseOrder->save();
            } elseif ($totalQuantity > 0) {
                $purchaseOrder->status = 'completed_partially';
                $purchaseOrder->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Stock received successfully',
                'po_item' => $poItem->load(['product', 'purchaseOrder.supplier'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to receive stock:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to receive stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recalculate costs for a purchase order.
     */
    public function recalculateCosts(Request $request, PurchaseOrder $purchaseOrder)
    {
        try {
            DB::beginTransaction();

            // Update final unit costs with current exchange rate
            $this->updateFinalUnitCosts($purchaseOrder);
            // Update total amount with current exchange rate
            $this->updateTotalAmount($purchaseOrder);

            $purchaseOrder->save();
            DB::commit();

            return response()->json([
                'message' => 'Costs recalculated successfully',
                'purchase_order' => $purchaseOrder->load(['items.product', 'supplier'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to recalculate costs:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to recalculate costs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update final unit costs for all items when exchange rate is modified
     * This calculates final_unit_cost as china_price * exchange_rate for draft/pending orders
     * For received/completed orders, it uses the full landed cost calculation
     */
    private function updateFinalUnitCosts(PurchaseOrder $order)
    {
        // Load order with items to ensure we have the latest data
        $order->load('items');

        // For orders that are not yet received, only calculate unit_price and total_price
        // final_unit_cost remains 0 until received at hub/bogura
        if (!in_array($order->status, ['received_hub', 'completed', 'completed_partially'])) {
            foreach ($order->items as $item) {
                // Calculate unit_price: china_price * exchange_rate
                $unitPrice = (float) $item->china_price * (float) $order->exchange_rate;

                // Calculate total_price: unit_price * quantity
                $totalPrice = $unitPrice * (int) $item->quantity;

                // Update only unit_price and total_price for draft/pending orders
                // final_unit_cost stays 0 until order is received at hub
                $item->unit_price = $unitPrice;
                $item->total_price = $totalPrice;
                // final_unit_cost remains 0 - will be calculated when received at bogura
                $item->save();
            }
        } else {
            // For received orders, use the full landed cost calculation
            $this->calculateAndFinalize($order);
        }
    }

    /**
     * Get purchase order items that are ready to be added to inventory
     * Logic: received_quantity > stocked_quantity
     */
    public function getItemsReadyToStock(Request $request)
    {
        try {
            $items = PurchaseOrderItem::with(['purchase_order.supplier', 'product', 'productVariant'])
                ->whereRaw('received_quantity > stocked_quantity')
                ->get();

            return response()->json([
                'data' => $items,
                'message' => 'Items ready to stock retrieved successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to get items ready to stock:', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to retrieve items ready to stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
