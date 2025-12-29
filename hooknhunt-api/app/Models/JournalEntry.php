<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    protected $guarded = ['id'];

    public function items()
    {
        return $this->hasMany(JournalItem::class);
    }

    // Polymorphic Relation
    public function reference()
    {
        return $this->morphTo();
    }
    
    // Check if Debit == Credit (Balance Check)
    public function isBalanced()
    {
        return $this->items->sum('debit') == $this->items->sum('credit');
    }
}