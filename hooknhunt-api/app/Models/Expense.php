<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'amount',
        'expense_date',
        'account_id',
        'paid_by',
        'reference_number',
        'notes',
        'attachment',
        'is_approved',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array<string, string>
     */
    protected $with = ['account', 'user'];

    /**
     * Relationship: Expense belongs to a Chart of Account (Expense Head)
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }

    /**
     * Relationship: Expense was paid by a User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    /**
     * Scope: Only approved expenses
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope: Only pending expenses
     */
    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    /**
     * Check if expense can be modified (only if not approved)
     */
    public function isModifiable(): bool
    {
        return !$this->is_approved;
    }

    /**
     * Get attachment URL (if stored in storage)
     */
    public function getAttachmentUrlAttribute(): string|null
    {
        if ($this->attachment) {
            return storage_path('app/public/' . $this->attachment);
        }
        return null;
    }
}
