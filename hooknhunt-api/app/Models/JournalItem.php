<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalItem extends Model
{
    protected $guarded = ['id'];

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class);
    }
}