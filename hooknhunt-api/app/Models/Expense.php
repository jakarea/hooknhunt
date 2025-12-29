<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // রিলেশনশিপ
    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }
}