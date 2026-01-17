<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Department has many employees (through user profiles)
     */
    public function employees()
    {
        return $this->hasMany(StaffProfile::class, 'department_id');
    }

    /**
     * Get all users belonging to this department
     */
    public function users()
    {
        return $this->hasManyThrough(
            User::class,
            StaffProfile::class,
            'department_id',
            'id',
            'id',
            'user_id'
        );
    }
}