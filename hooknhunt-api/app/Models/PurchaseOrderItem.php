<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'po_id',
        'product_id',
        'product_variant_id',
        'china_price',
        'quantity',
        'shipping_cost',
        'extra_cost',
        'lost_value',
        'lost_quantity',
        'lost_item_price',
        'final_unit_cost',
    ];

    protected $casts = [
        'china_price' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'extra_cost' => 'decimal:2',
        'lost_value' => 'decimal:2',
        'lost_item_price' => 'decimal:2',
        'final_unit_cost' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class, 'po_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    // Computed properties
    public function getEffectiveQuantityAttribute(): int
    {
        return $this->quantity - $this->lost_quantity;
    }

    public function getChinaCostBdtAttribute(): float
    {
        return $this->china_price * ($this->purchaseOrder->exchange_rate ?? 0);
    }

    public function getTotalItemCostAttribute(): float
    {
        $baseCost = $this->china_cost_bdt;
        $shippingCost = $this->shipping_cost * $this->quantity;

        return $baseCost + $shippingCost;
    }

    public function getLostItemValueAttribute(): float
    {
        return ($this->lost_quantity * $this->china_cost_bdt) +
               ($this->lost_quantity * $this->shipping_cost) +
               ($this->lost_quantity * $this->lost_item_price);
    }

    public function getEffectiveItemCostAttribute(): float
    {
        return $this->getTotalItemCostAttribute() - $this->lost_item_value;
    }

    public function getDistributedExtraCostAttribute(): float
    {
        $order = $this->purchaseOrder;
        if (!$order || !$order->total_quantity) {
            return 0;
        }

        $extraCostPerUnit = ($order->extra_cost_global ?? 0) / $order->total_quantity;

        return $extraCostPerUnit * $this->effective_quantity;
    }

    public function getEffectiveLandedCostAttribute(): float
    {
        if ($this->effective_quantity === 0) {
            return 0;
        }

        $totalCost = $this->effective_item_cost + $this->distributed_extra_cost;

        return $totalCost / $this->effective_quantity;
    }
}
