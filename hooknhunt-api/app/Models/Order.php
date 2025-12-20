<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'shipping_address',
        'shipping_city',
        'shipping_district',
        'status',
        'payment_method',
        'payment_details',
        'subtotal',
        'delivery_charge',
        'service_charge',
        'coupon_discount',
        'total_amount',
        'payable_amount',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'subtotal' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'service_charge' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'payable_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get formatted total amount.
     */
    public function getFormattedTotalAmountAttribute(): string
    {
        return '৳' . number_format($this->total_amount, 2);
    }

    /**
     * Get formatted payable amount.
     */
    public function getFormattedPayableAmountAttribute(): string
    {
        return '৳' . number_format($this->payable_amount, 2);
    }

    /**
     * Bootstrap the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate order number when creating
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . date('Y-m-d') . '-' . str_pad(static::whereDate('created_at', now())->count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }
}