<?php

namespace Modules\Auth\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * User Model (Auth Module)
 *
 * NOTE: This model has NO foreign key constraints.
 * Relationships use reference IDs only.
 * This makes the Auth module independent and copy-paste ready.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $guarded = ['id'];

    // Explicitly load role when needed (no auto-loading)
    // protected $with = ['role'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'role_id' => 'integer', // Reference ID only, NO foreign key constraint
    ];

    /**
     * Sanitize phone_verified_at - remove null bytes and invalid data
     */
    public function getPhoneVerifiedAtAttribute($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Remove null bytes and other non-printable characters
        $cleaned = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);

        if (empty($cleaned)) {
            return null;
        }

        // Check if it's a valid date format before parsing
        if (!preg_match('/^\d{4}-\d{2}-\d{2}/', $cleaned)) {
            \Log::warning('Invalid phone_verified_at format', [
                'user_id' => $this->id,
                'raw_value' => $value,
                'cleaned_value' => $cleaned
            ]);
            return null;
        }

        try {
            return \Carbon\Carbon::parse($cleaned);
        } catch (\Exception $e) {
            \Log::error('Failed to parse phone_verified_at', [
                'user_id' => $this->id,
                'value' => $cleaned,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Sanitize email_verified_at - remove null bytes and invalid data
     */
    public function getEmailVerifiedAtAttribute($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Remove null bytes and other non-printable characters
        $cleaned = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);

        if (empty($cleaned)) {
            return null;
        }

        // Check if it's a valid date format before parsing
        if (!preg_match('/^\d{4}-\d{2}-\d{2}/', $cleaned)) {
            \Log::warning('Invalid email_verified_at format', [
                'user_id' => $this->id,
                'raw_value' => $value,
                'cleaned_value' => $cleaned
            ]);
            return null;
        }

        try {
            return \Carbon\Carbon::parse($cleaned);
        } catch (\Exception $e) {
            \Log::error('Failed to parse email_verified_at', [
                'user_id' => $this->id,
                'value' => $cleaned,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Role relationship (from User module)
     * Reference ID only: role_id
     * NO foreign key constraint in database
     */
    public function role()
    {
        // Role belongs to User module - reference by ID only
        return $this->belongsTo(\Modules\User\App\Models\Role::class, 'role_id', 'id');
    }

    /**
     * User Profile relationship (from User module)
     * Reference ID only: user_id
     * NO foreign key constraint in database
     */
    public function profile()
    {
        return $this->hasOne(\Modules\User\App\Models\UserProfile::class, 'user_id', 'id');
    }

    /**
     * Staff Profile relationship (from HRM module)
     * Reference ID only: user_id
     * NO foreign key constraint in database
     */
    public function staffProfile()
    {
        return $this->hasOne(\Modules\Hrm\App\Models\StaffProfile::class, 'user_id', 'id');
    }

    /**
     * Customer Profile relationship (from CRM module)
     * Reference ID only: user_id
     * NO foreign key constraint in database
     */
    public function customerProfile()
    {
        return $this->hasOne(\Modules\Crm\App\Models\CustomerProfile::class, 'user_id', 'id');
    }

    /**
     * Customer addresses (from CRM module)
     * Reference ID only: customer_id (which references user_id)
     * NO foreign key constraint in database
     */
    public function addresses()
    {
        return $this->hasMany(\Modules\Crm\App\Models\Address::class, 'customer_id', 'id');
    }

    /**
     * Customer wallet (from Wallet module)
     * Reference ID only: user_id
     * NO foreign key constraint in database
     */
    public function wallet()
    {
        return $this->hasOne(\Modules\Wallet\App\Models\Wallet::class, 'user_id', 'id');
    }

    /**
     * Direct permissions (from User module)
     * Reference IDs only in pivot table: permission_user
     * NO foreign key constraints in database
     */
    public function directPermissions()
    {
        return $this->belongsToMany(
            \Modules\User\App\Models\Permission::class,
            'permission_user',
            'user_id',
            'permission_id'
        );
    }

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role && $this->role->slug === 'super_admin';
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermissionTo($slug): bool
    {
        // Super admins have all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        // ১. প্রথমেই চেক করুন এই ইউজারের জন্য এই পারমিশনটি 'Block' করা কি না
        $isBlocked = $this->directPermissions()
                        ->where('slug', $slug)
                        ->where('is_blocked', 1)
                        ->exists();

        if ($isBlocked) {
            return false; // রোলে থাকলেও সে এটি করতে পারবে না
        }

        // ২. আগের মতো রোল এবং ডাইরেক্ট পারমিশন চেক করুন
        $rolePermissions = $this->role?->permissions()->pluck('slug')->toArray() ?? [];
        $directAllowed = $this->directPermissions()
                            ->where('is_blocked', 0)
                            ->pluck('slug')->toArray();

        return in_array($slug, array_merge($rolePermissions, $directAllowed));
    }

    /**
     * Get all users including super_admin
     */
    public function scopeWithSuperAdmin($query)
    {
        return $query;
    }
}
