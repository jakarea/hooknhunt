<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }
    public function directPermissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }

    /**
     * Check if user is Super Admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role && $this->role->slug === 'super_admin';
    }

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

}