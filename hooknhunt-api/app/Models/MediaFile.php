<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'original_filename',
        'mime_type',
        'extension',
        'size_bytes',
        'width',
        'height',
        'alt_text',
        'title',
        'description',
        'disk',
        'path',
        'url',
        'variants',
        'hash',
        'folder_id',
        'uploaded_by_user_id',
        'usage_count',
        'usage_models',
    ];

    protected $casts = [
        'variants' => 'array',
        'usage_models' => 'array',
        'width' => 'integer',
        'height' => 'integer',
        'size_bytes' => 'integer',
        'usage_count' => 'integer',
    ];

    /**
     * Get the folder that contains the media file.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class);
    }

    /**
     * Get the user who uploaded the media file.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }

    /**
     * Get all models that use this media file.
     */
    public function usages(): MorphMany
    {
        return $this->morphMany(MediaUsage::class, 'media');
    }

    /**
     * Check if the file is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if the file is a video.
     */
    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    /**
     * Check if the file is a document.
     */
    public function isDocument(): bool
    {
        return str_starts_with($this->mime_type, 'application/') ||
               str_starts_with($this->mime_type, 'text/');
    }

    /**
     * Get the human-readable file size.
     */
    protected function humanSize(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $bytes = $this->size_bytes;
                $units = ['B', 'KB', 'MB', 'GB', 'TB'];

                for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
                    $bytes /= 1024;
                }

                return round($bytes, 2) . ' ' . $units[$i];
            },
        );
    }

    /**
     * Get the full URL for the media file.
     */
    protected function fullUrl(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$this->url) {
                    return Storage::disk($this->disk)->url($this->path);
                }
                return $this->url;
            },
        );
    }

    /**
     * Get a specific variant URL.
     */
    public function getVariantUrl(string $variant): ?string
    {
        return $this->variants[$variant] ?? null;
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrl(): ?string
    {
        return $this->getVariantUrl('thumbnail') ?: ($this->isImage() ? $this->full_url : null);
    }

    /**
     * Increment usage count and track model usage.
     */
    public function recordUsage(string $modelType, int $modelId): void
    {
        $this->increment('usage_count');

        $usageModels = $this->usage_models ?? [];
        $key = "{$modelType}:{$modelId}";

        if (!in_array($key, $usageModels)) {
            $usageModels[] = $key;
            $this->update(['usage_models' => $usageModels]);
        }
    }

    /**
     * Remove usage tracking for a specific model.
     */
    public function removeUsage(string $modelType, int $modelId): void
    {
        $usageModels = $this->usage_models ?? [];
        $key = "{$modelType}:{$modelId}";

        $usageModels = array_values(array_filter($usageModels, fn($model) => $model !== $key));

        $this->update([
            'usage_models' => $usageModels,
            'usage_count' => max(0, $this->usage_count - 1),
        ]);
    }

    /**
     * Generate a unique filename.
     */
    public static function generateUniqueFilename(string $originalFilename): string
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $basename = pathinfo($originalFilename, PATHINFO_FILENAME);
        $slug = Str::slug($basename);

        return $slug . '-' . Str::random(8) . '.' . $extension;
    }

    /**
     * Generate SHA-256 hash for a file.
     */
    public static function generateFileHash(string $filePath): string
    {
        return hash_file('sha256', $filePath) ?: '';
    }
}
