<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'retail_name',
        'retail_price',
        'wholesale_name',
        'wholesale_price',
        'daraz_name',
        'daraz_price',
        'landed_cost',
        'moq_wholesale',
        'weight',
        'dimensions',
        'status',
    ];

    protected $casts = [
        'retail_price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'daraz_price' => 'decimal:2',
        'landed_cost' => 'decimal:2',
        'moq_wholesale' => 'integer',
        'weight' => 'decimal:2',
        'dimensions' => 'json',
        'status' => 'string',
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    public function attributeOptions(): BelongsToMany
    {
        return $this->belongsToMany(AttributeOption::class, 'variant_attribute_options');
    }

    // Computed properties
    public function getRetailMarginAttribute(): float
    {
        return $this->retail_price - $this->landed_cost;
    }

    public function getWholesaleMarginAttribute(): float
    {
        return $this->wholesale_price - $this->landed_cost;
    }

    public function getRetailMarginPercentageAttribute(): float
    {
        return $this->landed_cost > 0
            ? (($this->retail_price - $this->landed_cost) / $this->landed_cost) * 100
            : 0;
    }

    public function getWholesaleMarginPercentageAttribute(): float
    {
        return $this->landed_cost > 0
            ? (($this->wholesale_price - $this->landed_cost) / $this->landed_cost) * 100
            : 0;
    }

    public function getCurrentStockAttribute(): int
    {
        $inventory = $this->inventory()->first();
        return $inventory ? $inventory->quantity : 0;
    }

    public function getAvailableStockAttribute(): int
    {
        $inventory = $this->inventory()->first();
        return $inventory ? $inventory->available_quantity : 0;
    }

    // Helper methods
    public function isInStock(): bool
    {
        return $this->available_stock > 0;
    }

    public function isLowStock(): bool
    {
        $inventory = $this->inventory()->first();
        return $inventory ? $inventory->is_low_stock : false;
    }

    public function getFullNameAttribute(): string
    {
        $name = $this->retail_name ?: $this->sku;
        if ($this->product) {
            $name = $this->product->base_name . ' - ' . $name;
        }
        return $name;
    }
}
