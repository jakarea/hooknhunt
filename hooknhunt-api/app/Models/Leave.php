<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Leave extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // আবেদনকারী
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // অনুমোদনকারী
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}