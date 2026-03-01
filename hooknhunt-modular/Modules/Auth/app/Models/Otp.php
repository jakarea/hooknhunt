<?php

namespace Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * OTP Model (Auth Module)
 *
 * One-time passwords for phone/email verification
 * NO foreign key constraints - reference ID only
 */
class Otp extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
        'user_id' => 'integer', // Reference ID only, NO foreign key constraint
    ];

    /**
     * User relationship (Auth module)
     * Reference ID only: user_id
     * NO foreign key constraint in database
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Check if OTP is still valid (not expired)
     */
    public function isValid(): bool
    {
        return $this->expires_at->isFuture();
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
