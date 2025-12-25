<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Hook & Hunt',
                'slug' => 'hook-hunt',
                'logo' => 'https://via.placeholder.com/200x200/BC1215/FFFFFF?text=Hook+%26+Hunt',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shimano',
                'slug' => 'shimano',
                'logo' => 'https://via.placeholder.com/200x200/000000/FFFFFF?text=Shimano',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Daiwa',
                'slug' => 'daiwa',
                'logo' => 'https://via.placeholder.com/200x200/0066CC/FFFFFF?text=Daiwa',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Penn',
                'slug' => 'penn',
                'logo' => 'https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Penn',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Abu Garcia',
                'slug' => 'abu-garcia',
                'logo' => 'https://via.placeholder.com/200x200/006633/FFFFFF?text=Abu+Garcia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert brands without duplicates
        foreach ($brands as $brand) {
            Brand::firstOrCreate(
                ['slug' => $brand['slug']],
                $brand
            );
        }
    }
}