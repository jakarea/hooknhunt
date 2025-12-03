<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'base_name',
        'slug',
        'status',
        'meta_title',
        'meta_description',
        'base_thumbnail_url',
        'gallery_images',
    ];

    protected $casts = [
        'gallery_images' => 'array',
    ];

    /**
     * Get the full URL for the base thumbnail.
     */
    protected function baseThumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? url( $value) : null,
        );
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
