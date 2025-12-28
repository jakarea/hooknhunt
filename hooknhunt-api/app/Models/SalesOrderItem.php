<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesOrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_variant_id',
        'inventory_batch_id',
        'quantity',
        'unit_price',
        'landed_cost_at_sale',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'landed_cost_at_sale' => 'decimal:2',
    ];

    /**
     * Relationships
     */

    // Each sales order item belongs to a sales order
    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class, 'order_id');
    }

    // Each sales order item is for a specific product variant
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    // Each sales order item comes from a specific inventory batch
    public function inventoryBatch(): BelongsTo
    {
        return $this->belongsTo(InventoryBatch::class);
    }

    /**
     * Accessors & Helpers
     */

    // Calculate total price for this line item
    public function getTotalPriceAttribute(): float
    {
        return $this->quantity * $this->unit_price;
    }

    // Calculate total landed cost for this line item
    public function getTotalLandedCostAttribute(): float
    {
        return $this->quantity * $this->landed_cost_at_sale;
    }

    // Calculate profit for this line item
    public function getProfitAttribute(): float
    {
        return $this->total_price - $this->total_landed_cost;
    }

    // Calculate profit margin percentage
    public function getProfitMarginAttribute(): float
    {
        return $this->total_price > 0
            ? ($this->profit / $this->total_price) * 100
            : 0;
    }
}
