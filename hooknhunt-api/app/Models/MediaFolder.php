<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class MediaFolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'sort_order',
        'is_public',
        'allowed_roles',
    ];

    protected $casts = [
        'allowed_roles' => 'array',
        'is_public' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the child folders.
     */
    public function children(): HasMany
    {
        return $this->hasMany(MediaFolder::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Get the parent folder.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'parent_id');
    }

    /**
     * Get the media files in this folder.
     */
    public function mediaFiles(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'folder_id')->latest();
    }

    /**
     * Get all descendants (recursive children).
     */
    public function descendants(): HasMany
    {
        return $this->hasMany(MediaFolder::class, 'parent_id')->with('descendants');
    }

    /**
     * Get the full path of the folder.
     */
    public function getFullPath(): string
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' / ', $path);
    }

    /**
     * Check if user can access this folder.
     */
    public function canBeAccessedBy($user): bool
    {
        if ($this->is_public) {
            return true;
        }

        if (!$user) {
            return false;
        }

        $allowedRoles = $this->allowed_roles ?? [];
        return empty($allowedRoles) || in_array($user->role, $allowedRoles);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from name
        static::saving(function ($folder) {
            if ($folder->isDirty('name') && !$folder->slug) {
                $folder->slug = Str::slug($folder->name);
            }
        });
    }
}
