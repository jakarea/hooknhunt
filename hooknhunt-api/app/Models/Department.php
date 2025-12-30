<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $guarded = ['id'];

    public function employees()
    {
        // UserProfile এর মাধ্যমে User এর সাথে সম্পর্ক
        return $this->hasManyThrough(User::class, UserProfile::class, 'department_id', 'id', 'id', 'user_id');
    }
}