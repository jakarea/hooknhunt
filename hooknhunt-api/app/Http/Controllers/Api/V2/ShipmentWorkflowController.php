<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentItem;
use App\Models\InventoryBatch;
use App\Models\SupplierLedger;
use App\Models\ShipmentHistory; // Added Model
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ShipmentWorkflowController extends Controller
{
    use ApiResponse;

    /**
     * Step 1: Draft Created
     * Generates Internal PO Number. Lot Number remains NULL initially.
     */
    public function createDraft(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.china_price' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();
        try {
            // Generate Internal Unique PO Number
            $poNumber = 'PO-' . date('Ymd') . '-' . strtoupper(uniqid());

            $shipment = Shipment::create([
                'supplier_id' => $request->supplier_id,
                'po_number' => $poNumber, // Internal ID
                'lot_number' => null,     // External Cargo ID (Set in Step 5)
                'status' => 'draft',
                'total_china_cost_rmb' => 0
            ]);

            $totalRMB = 0;

            foreach ($request->items as $item) {
                ShipmentItem::create([
                    'shipment_id' => $shipment->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => null,
                    'ordered_qty' => $item['quantity'],
                    'unit_price_rmb' => $item['china_price'],
                ]);
                $totalRMB += ($item['quantity'] * $item['china_price']);
            }

            $shipment->update(['total_china_cost_rmb' => $totalRMB]);
            
            $this->logTimeline($shipment, 'Draft Created', "Order Initialized. PO: {$poNumber}");

            DB::commit();
            return $this->sendSuccess($shipment->load('items'), 'Step 1: Draft Created');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Steps 2 to 7: Status Updates & Inputs (With History Tracking)
     */
    public function updateStep(Request $request, $id)
    {
        $shipment = Shipment::findOrFail($id);
        
        // Keep a copy of old data for history tracking
        $oldData = $shipment->replicate();

        $action = $request->action; 
        $request->validate(['action' => 'required|string']);

        DB::beginTransaction();
        try {
            switch ($action) {
                
                // Step 2: Payment Confirmed
                case 'confirm_payment':
                    $request->validate(['exchange_rate' => 'required|numeric']);
                    $shipment->exchange_rate = $request->exchange_rate;
                    $shipment->status = 'payment_confirmed';
                    $this->logTimeline($shipment, 'Payment Confirmed', "Rate: {$request->exchange_rate}");
                    break;

                // Step 3: Supplier Dispatched
                case 'supplier_dispatch':
                    $request->validate(['int_courier_name' => 'required', 'int_tracking_no' => 'required']);
                    $shipment->int_courier_name = $request->int_courier_name;
                    $shipment->int_tracking_no = $request->int_tracking_no;
                    $shipment->status = 'shipped_from_china';
                    $this->logTimeline($shipment, 'Supplier Dispatched', "Tracking: {$request->int_tracking_no}");
                    break;

                // Step 4: Warehouse Received
                case 'warehouse_received':
                    $shipment->status = 'warehouse_china';
                    $this->logTimeline($shipment, 'Warehouse Received', 'Received at China Warehouse');
                    break;

                // Step 5: Shipped to BD (Assign Real Lot Number)
                case 'ship_to_bd':
                    $request->validate(['lot_number' => 'required|string']);
                    // We update lot_number (Cargo ID), NOT po_number
                    $shipment->lot_number = $request->lot_number; 
                    $shipment->status = 'shipped_to_bd';
                    $this->logTimeline($shipment, 'Shipped to BD', "Cargo Lot Assigned: {$request->lot_number}");
                    break;

                // Step 6: Arrived BD
                case 'arrived_bd':
                    $request->validate([
                        'shipping_cost_intl' => 'required|numeric',
                        'shipping_cost_local' => 'nullable|numeric'
                    ]);
                    $shipment->shipping_cost_intl = $request->shipping_cost_intl;
                    $shipment->shipping_cost_local = $request->shipping_cost_local ?? 0;
                    $shipment->status = 'customs_clearing'; 
                    $shipment->arrived_bd_at = now();
                    $this->logTimeline($shipment, 'Arrived in Bangladesh', 'Shipping costs updated');
                    break;

                // Step 7: In Transit to Bogura
                case 'transit_bogura':
                    $request->validate(['bd_tracking_no' => 'required']);
                    $shipment->bd_tracking_no = $request->bd_tracking_no;
                    $shipment->bd_courier_name = $request->bd_courier_name ?? 'Local Courier';
                    $shipment->status = 'received_bogura'; 
                    $this->logTimeline($shipment, 'In Transit to Bogura', "Local Tracking: {$request->bd_tracking_no}");
                    break;
                
                // GENERAL EDIT (Anytime Correction)
                case 'edit_info':
                    // Allow editing specific fields if user made a mistake
                    $shipment->fill($request->only([
                        'exchange_rate', 'int_tracking_no', 'lot_number', 'bd_tracking_no', 
                        'shipping_cost_intl', 'shipping_cost_local'
                    ]));
                    break;
            }

            $shipment->save();

            // --- HISTORY TRACKING LOGIC ---
            if ($shipment->wasChanged()) {
                $changes = $shipment->getChanges();
                foreach ($changes as $field => $newValue) {
                    if ($field == 'updated_at' || $field == 'status') continue; // Skip timestamps & status (status tracked in timeline)
                    
                    ShipmentHistory::create([
                        'shipment_id' => $shipment->id,
                        'user_id' => auth()->id() ?? 1, // Fallback to 1 if testing without auth
                        'field_name' => $field,
                        'old_value' => $oldData->$field,
                        'new_value' => $newValue,
                        'reason' => $request->edit_reason ?? "Step Update: {$action}"
                    ]);
                }
            }

            DB::commit();
            return $this->sendSuccess($shipment, "Step Updated: {$action}");

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Steps 8-10: Receive at Bogura (Logic Unchanged from previous accurate version)
     */
    public function receiveAtBogura(Request $request, $id)
    {
        $request->validate([
            'total_extra_cost' => 'nullable|numeric|min:0',
            'total_extra_weight' => 'nullable|numeric|min:0',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:shipment_items,id',
            'items.*.received_qty' => 'required|integer|min:0',
            'items.*.unit_weight' => 'required|numeric|min:0.001',
        ]);

        $shipment = Shipment::with('items')->findOrFail($id);

        if ($shipment->status === 'completed') {
            return $this->sendError('Shipment already completed.');
        }

        DB::beginTransaction();
        try {
            $shipment->total_extra_cost = $request->total_extra_cost ?? 0;
            $shipment->total_extra_weight = $request->total_extra_weight ?? 0;
            
            $totalReceivedWeight = 0;
            $walletAdjustmentRMB = 0;
            $timelineNote = "";

            foreach ($request->items as $input) {
                $totalReceivedWeight += ($input['received_qty'] * $input['unit_weight']);
            }

            foreach ($request->items as $input) {
                $item = $shipment->items->where('id', $input['item_id'])->first();
                $orderedQty = $item->ordered_qty;
                $receivedQty = $input['received_qty'];

                $diff = $orderedQty - $receivedQty;
                $variance = ($orderedQty > 0) ? (abs($diff) / $orderedQty) * 100 : 0;
                $adjustWallet = false;

                if ($variance > 5) {
                    $adjustWallet = true;
                    $rmbAmount = $diff * $item->unit_price_rmb; 
                    $walletAdjustmentRMB += $rmbAmount;
                    $timelineNote .= ($diff > 0) ? "Shortage: {$diff}pc " : "Excess: ".abs($diff)."pc ";
                }

                $item->received_qty = $receivedQty;
                $item->unit_weight = $input['unit_weight'];

                if ($totalReceivedWeight > 0 && $receivedQty > 0) {
                    $weightRatio = ($receivedQty * $input['unit_weight']) / $totalReceivedWeight;
                    
                    $effectiveRMB = $adjustWallet ? ($receivedQty * $item->unit_price_rmb) : ($orderedQty * $item->unit_price_rmb);
                    
                    $baseCostBD = $effectiveRMB * $shipment->exchange_rate;
                    $shippingShare = ($shipment->shipping_cost_intl + $shipment->shipping_cost_local) * $weightRatio;
                    $extraCostShare = $shipment->total_extra_cost * $weightRatio;

                    $item->calculated_landed_cost = ($baseCostBD + $shippingShare + $extraCostShare) / $receivedQty;
                } else {
                    $item->calculated_landed_cost = 0;
                }
                $item->save();

                if ($receivedQty > 0) {
                    InventoryBatch::create([
                        'product_id' => $item->product_id,
                        'product_variant_id' => null,
                        'warehouse_id' => 3, 
                        'batch_no' => $shipment->lot_number ?? $shipment->po_number, // Use Lot if available, else PO
                        'cost_price' => round($item->calculated_landed_cost, 2),
                        'initial_qty' => $receivedQty,
                        'remaining_qty' => $receivedQty,
                        'created_at' => now()
                    ]);
                }
            }

            if (abs($walletAdjustmentRMB) > 0) {
                $type = $walletAdjustmentRMB > 0 ? 'refund' : 'purchase';
                $lastLedger = SupplierLedger::where('supplier_id', $shipment->supplier_id)->latest('id')->first();
                $newBalance = ($lastLedger ? $lastLedger->balance : 0) + $walletAdjustmentRMB;

                SupplierLedger::create([
                    'supplier_id' => $shipment->supplier_id,
                    'type' => $type,
                    'amount' => abs($walletAdjustmentRMB),
                    'balance' => $newBalance,
                    'reason' => "Adjustment for PO {$shipment->po_number}. " . $timelineNote,
                    'transaction_id' => 'TXN-' . time()
                ]);
            }

            $shipment->status = 'completed';
            $shipment->arrived_bogura_at = now();
            $shipment->save();
            
            $this->logTimeline($shipment, 'Order Completed', "Received at Bogura. Stock Added. {$timelineNote}");

            DB::commit();
            return $this->sendSuccess($shipment, 'Step 8-10: Received & Completed');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    private function logTimeline($shipment, $label, $desc) {
        $shipment->timelines()->create([
            'status_label' => $label,
            'description' => $desc,
            'updated_by' => auth()->id() ?? 1
        ]);
    }

    /**
     * Get Single Shipment with Timeline & History
     */
    public function show($id)
    {
        $shipment = Shipment::with([
            'supplier:id,name',
            // Fix: 'sku' removed because it exists in product_variants table, not products
            'items.product:id,name,slug', 
            'timelines',
            'histories.user:id,name'
        ])->findOrFail($id);
        
        return $this->sendSuccess($shipment, 'Shipment details with history fetched.');
    }
}