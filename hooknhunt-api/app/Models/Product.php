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
}
