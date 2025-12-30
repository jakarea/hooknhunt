<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $guarded = ['id'];

    // রিলেশনশিপ: বেতনটি কোন স্টাফের?
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}