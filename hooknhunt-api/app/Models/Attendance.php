<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $guarded = ['id'];

    // টাইম কলামগুলো কার্বন ইনস্ট্যান্সে কনভার্ট করার জন্য
    protected $casts = [
        'date' => 'date',
        // time কলামগুলো সাধারণত string হিসেবে আসে, তবে চাইলে format করা যায়
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}