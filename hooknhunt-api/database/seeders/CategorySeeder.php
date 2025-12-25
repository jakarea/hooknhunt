<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Spinning Rods',
                'slug' => 'spinning-rods',
                'image_url' => 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Spinning+Rods',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Casting Rods',
                'slug' => 'casting-rods',
                'image_url' => 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Casting+Rods',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Telescopic Rods',
                'slug' => 'telescopic-rods',
                'image_url' => 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Telescopic+Rods',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Spinning Reels',
                'slug' => 'spinning-reels',
                'image_url' => 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Spinning+Reels',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Baitcasting Reels',
                'slug' => 'baitcasting-reels',
                'image_url' => 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Baitcasting+Reels',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Monofilament Lines',
                'slug' => 'monofilament-lines',
                'image_url' => 'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Monofilament+Lines',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Braided Lines',
                'slug' => 'braided-lines',
                'image_url' => 'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Braided+Lines',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fluorocarbon Lines',
                'slug' => 'fluorocarbon-lines',
                'image_url' => 'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Fluorocarbon+Lines',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fishing Hooks',
                'slug' => 'fishing-hooks',
                'image_url' => 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Fishing+Hooks',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Swivels & Snap Clips',
                'slug' => 'swivels-snap-clips',
                'image_url' => 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Swivels+%26+Snaps',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Weights & Sinkers',
                'slug' => 'weights-sinkers',
                'image_url' => 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Weights+%26+Sinkers',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hard Lures',
                'slug' => 'hard-lures',
                'image_url' => 'https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Hard+Lures',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Soft Lures',
                'slug' => 'soft-lures',
                'image_url' => 'https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Soft+Lures',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fishing Tools',
                'slug' => 'fishing-tools',
                'image_url' => 'https://via.placeholder.com/400x300/84CC16/FFFFFF?text=Fishing+Tools',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fishing Bags & Storage',
                'slug' => 'fishing-bags-storage',
                'image_url' => 'https://via.placeholder.com/400x300/F97316/FFFFFF?text=Fishing+Bags',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert categories without duplicates
        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}