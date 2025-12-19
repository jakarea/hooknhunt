<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'po_number',
        'product_id',
        'product_variant_id',
        'china_price',
        'quantity',
        'unit_weight',
        'extra_weight',
        'received_quantity',
        'stocked_quantity',
        'final_unit_cost',
    ];

    protected $casts = [
        'china_price' => 'decimal:2',
        'unit_weight' => 'decimal:2',
        'extra_weight' => 'decimal:2',
        'received_quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class, 'po_number');
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
        return $this->received_quantity ?? $this->quantity;
    }

    public function getTotalWeightAttribute(): float
    {
        $unitWeight = $this->unit_weight ?? 0;
        $extraWeight = $this->extra_weight ?? 0;
        return ($unitWeight + $extraWeight) * $this->quantity;
    }
}
