<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number',
        'supplier_id',
        'exchange_rate',
        'order_date',
        'expected_date',
        'total_amount',
        'courier_name',
        'tracking_number',
        'lot_number',
        'shipping_method',
        'shipping_cost',
        'total_weight',
        'extra_cost_global',
        'bd_courier_tracking',
        'status',
        'created_by',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_weight' => 'decimal:2',
        'extra_cost_global' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'order_date' => 'date',
        'expected_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class, 'po_number');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Computed properties
    public function getTotalQuantityAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getTotalLostQuantityAttribute(): int
    {
        return $this->items->sum('received_quantity');
    }

    public function getEffectiveQuantityAttribute(): int
    {
        return $this->total_quantity - $this->total_received_quantity;
    }

    public function getTotalChinaCostAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->china_price * $item->quantity;
        });
    }

    public function getTotalChinaCostBdtAttribute(): float
    {
        return $this->total_china_cost * ($this->exchange_rate ?? 0);
    }

    public function getTotalShippingCostAttribute(): float
    {
        return $this->items->sum('shipping_cost');
    }

    public function getTotalLostValueAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return ($item->received_quantity * $item->china_price * ($this->exchange_rate ?? 0)) +
                   ($item->received_quantity * $item->shipping_cost) +
                   ($item->received_quantity * $item->lost_item_price);
        });
    }

    public function getTotalLandedCostBdtAttribute(): float
    {
        return $this->total_china_cost_bdt +
               $this->total_shipping_cost +
               ($this->extra_cost_global ?? 0) -
               $this->total_lost_value;
    }

    public function getAverageLandedCostPerUnitAttribute(): float
    {
        return $this->effective_quantity > 0
            ? $this->total_landed_cost_bdt / $this->effective_quantity
            : 0;
    }

    // Helper methods for status workflow
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isPaymentConfirmed(): bool
    {
        return $this->status === 'payment_confirmed';
    }

    public function isSupplierDispatched(): bool
    {
        return $this->status === 'supplier_dispatched';
    }

    public function isWarehouseReceived(): bool
    {
        return $this->status === 'warehouse_received';
    }

    public function isShippedBd(): bool
    {
        return $this->status === 'shipped_bd';
    }

    public function isArrivedBd(): bool
    {
        return $this->status === 'arrived_bd';
    }

    public function isInTransitBogura(): bool
    {
        return $this->status === 'in_transit_bogura';
    }

    public function isReceivedHub(): bool
    {
        return $this->status === 'received_hub';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isLost(): bool
    {
        return $this->status === 'lost';
    }

    // Status flow validation
    public function canTransitionTo(string $newStatus): bool
    {
        $currentStatus = $this->status;

        $allowedTransitions = [
            'draft' => ['payment_confirmed', 'lost'],
            'payment_confirmed' => ['supplier_dispatched', 'lost'],
            'supplier_dispatched' => ['warehouse_received', 'lost'],
            'warehouse_received' => ['shipped_bd', 'lost'],
            'shipped_bd' => ['arrived_bd', 'lost'],
            'arrived_bd' => ['in_transit_bogura', 'lost'],
            'in_transit_bogura' => ['received_hub', 'completed_partially', 'lost'],
            'received_hub' => ['completed', 'lost'],
            'completed_partially' => [], // Final status (partial completion due to lost items)
            'completed' => [], // Final status
            'lost' => [], // Final status
        ];

        return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
    }

    // Generate order number
    // Format: PO-{Year}{Month}-{ID} (e.g., PO-202511-15)
    public function generateOrderNumber(): string
    {
        $yearMonth = now()->format('Ym');
        return "PO-{$yearMonth}-{$this->id}";
    }
}
