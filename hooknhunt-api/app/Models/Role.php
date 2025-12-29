<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $guarded = ['id'];

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