<?php

namespace Modules\CRM\Models;

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

    // রিলেশন: শুধুমাত্র আপকামিং স্কেজুলড এক্টিভিটি
    public function scheduledActivities()
    {
        return $this->hasMany(CrmActivity::class)
            ->where('is_done', false)
            ->whereNotNull('schedule_at')
            ->orderBy('schedule_at', 'asc');
    }

    // যদি কনভার্ট হয়ে যায়
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'converted_customer_id');
    }
}