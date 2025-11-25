<?php

namespace App\Models;

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
     * Get the suppliers for the product.
     */
    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier')
            ->withPivot('supplier_product_urls')
            ->withTimestamps();
    }
}
