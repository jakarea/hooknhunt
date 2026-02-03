<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $fillable = [
        'name',
        'slug',
        'description',
        'position',
    ];

    /**
     * The "booted" method of the model.
     * Automatically exclude super_admin role from all queries
     */
    protected static function booted()
    {
        static::addGlobalScope('excludeSuperAdmin', function (Builder $builder) {
            $builder->where('slug', '!=', 'super_admin');
        });
    }

    /**
     * Get all roles including super_admin (use for specific backend operations only)
     */
    public function scopeWithSuperAdmin($query)
    {
        return $query->withoutGlobalScope('excludeSuperAdmin');
    }

    // Relation: A role has many users
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Relation: Permissions
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }
}