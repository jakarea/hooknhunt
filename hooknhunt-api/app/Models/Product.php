<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'base_name',
        'slug',
        'status',
        'meta_title',
        'meta_description',
        'description',
        'category_ids', // Store multiple categories as JSON array
        'base_thumbnail_url',
        'gallery_images',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'category_ids' => 'array',
    ];

    /**
     * Get the full URL for the base thumbnail.
     */
    protected function baseThumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? url('storage/' . $value) : null,
        );
    }

    /**
     * Get categories from the JSON field.
     */
    public function getCategoriesAttribute()
    {
        $categoryIds = $this->category_ids;

        // Handle if category_ids is a JSON string (e.g., "[1,2,3]")
        if (is_string($categoryIds)) {
            $categoryIds = json_decode($categoryIds, true) ?? [];
        }

        if (empty($categoryIds) || !is_array($categoryIds)) {
            return collect([]);
        }

        try {
            return Category::whereIn('id', $categoryIds)->get();
        } catch (\Exception $e) {
            \Log::error('Error loading categories for product ' . $this->id . ': ' . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Get category names as comma-separated string (for backward compatibility).
     */
    public function getCategoryNamesAttribute()
    {
        $categories = $this->categories;
        return $categories->pluck('name')->implode(', ');
    }

    /**
     * Get the variants for the product.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get the suppliers for the product.
     */
    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier')
            ->withPivot('supplier_product_urls')
            ->withTimestamps();
    }
}
