<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'brand_id',
        'thumbnail_id',
        'gallery_images',
        'description',
        'short_description',
        'video_url',
        'seo_title',
        'seo_description',
        'seo_tags',
        'status',
        'warranty_enabled',
        'warranty_details',
        'highlights',
        'includes_in_box',
    ];

    protected $casts = [
        'gallery_images' => 'array', // JSON Column for multiple images
        'seo_tags' => 'array', // JSON Column for SEO tags
        'highlights' => 'array', // JSON Column for product highlights
        'includes_in_box' => 'array', // JSON Column for items included in box
        'warranty_enabled' => 'boolean',
    ];

    // 1. Relation with Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // 2. Relation with Brand
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // 3. Relation with Variants
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // 4. Relation with Thumbnail (This was missing)
    public function thumbnail()
    {
        return $this->belongsTo(MediaFile::class, 'thumbnail_id');
    }

    // 5. Accessor for Gallery Images (Optional Helper)
    // যেহেতু gallery_images একটি JSON কলাম (IDs), সরাসরি রিলেশন করা কঠিন।
    // তাই আমরা একটি Accessor বা Helper মেথড রাখতে পারি।
    public function getGalleryFilesAttribute()
    {
        if (empty($this->gallery_images)) return [];
        return MediaFile::whereIn('id', $this->gallery_images)->get();
    }
    


    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier')
                    ->withPivot('product_links', 'supplier_sku', 'cost_price')
                    ->withTimestamps();
    }

    // 6. Relation with Attributes (for additional product properties)
    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'attribute_product')
                    ->withPivot('value', 'option_ids')
                    ->withTimestamps();
    }
}