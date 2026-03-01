<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// Import shared events
use Shared\Events\UserRegistered;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'is_active',
        'phone_verified_at',
        'user_type', // customer, staff, supplier, admin
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Boot method to dispatch events.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            // Dispatch UserRegistered event
            event(new UserRegistered(
                userId: $user->id,
                name: $user->name,
                email: $user->email,
                phone: $user->phone,
                userType: $user->user_type ?? 'customer',
            ));
        });
    }
}
