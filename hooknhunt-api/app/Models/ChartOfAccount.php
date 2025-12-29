<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relationship: One Account has many Journal Entries (Ledger Lines)
     */
    public function journalItems()
    {
        return $this->hasMany(JournalItem::class, 'account_id');
    }

    /**
     * Relationship: One Account (Expense Type) can have many Expense Requests
     */
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'account_id');
    }
}