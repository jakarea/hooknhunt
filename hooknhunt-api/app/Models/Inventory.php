<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    protected $fillable = [
        'product_variant_id',
        'quantity',
        'reserved_quantity',
        'available_quantity',
        'low_stock_threshold',
        'last_updated_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'reserved_quantity' => 'integer',
        'available_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'last_updated_at' => 'datetime',
    ];

    // Relationships
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    // Computed properties
    public function getIsLowStockAttribute(): bool
    {
        return $this->available_quantity <= $this->low_stock_threshold;
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->available_quantity <= 0) {
            return 'out_of_stock';
        } elseif ($this->is_low_stock) {
            return 'low_stock';
        } else {
            return 'in_stock';
        }
    }

    // Helper methods
    public function reserveStock(int $quantity): bool
    {
        if ($this->available_quantity < $quantity) {
            return false;
        }

        $this->reserved_quantity += $quantity;
        $this->available_quantity = $this->quantity - $this->reserved_quantity;
        $this->last_updated_at = now();
        $this->save();

        return true;
    }

    public function releaseReservation(int $quantity): void
    {
        $this->reserved_quantity = max(0, $this->reserved_quantity - $quantity);
        $this->available_quantity = $this->quantity - $this->reserved_quantity;
        $this->last_updated_at = now();
        $this->save();
    }

    public function fulfillReservation(int $quantity): bool
    {
        if ($this->reserved_quantity < $quantity) {
            return false;
        }

        $this->quantity -= $quantity;
        $this->reserved_quantity -= $quantity;
        $this->available_quantity = $this->quantity - $this->reserved_quantity;
        $this->last_updated_at = now();
        $this->save();

        return true;
    }

    public function addStock(int $quantity): void
    {
        $this->quantity += $quantity;
        $this->available_quantity = $this->quantity - $this->reserved_quantity;
        $this->last_updated_at = now();
        $this->save();
    }
}
