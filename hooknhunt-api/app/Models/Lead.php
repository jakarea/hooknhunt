<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $guarded = ['id'];

    // রিলেশন: লিডটি কোন স্টাফ হ্যান্ডেল করছে
    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // রিলেশন: এই লিডের সাথে কী কী কথা হয়েছে
    public function activities()
    {
        return $this->hasMany(CrmActivity::class);
    }

    // যদি কনভার্ট হয়ে যায়
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'converted_customer_id');
    }
}