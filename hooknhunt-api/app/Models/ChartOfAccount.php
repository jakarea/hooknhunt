<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'type',
        'is_active',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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

    /**
     * Scope: Only active accounts
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Filter by account type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get type label
     */
    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            'asset' => 'Asset',
            'liability' => 'Liability',
            'equity' => 'Equity',
            'income' => 'Revenue',
            'expense' => 'Expense',
            default => 'Unknown',
        };
    }
}
