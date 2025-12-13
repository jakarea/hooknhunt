<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed attributes and their options.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'color',
                'display_name' => 'Color',
                'type' => 'color',
                'is_required' => true,
                'is_visible' => true,
                'sort_order' => 1,
                'options' => [
                    ['display_value' => 'Red', 'value' => 'red', 'color_code' => '#FF0000', 'sort_order' => 1],
                    ['display_value' => 'Blue', 'value' => 'blue', 'color_code' => '#0000FF', 'sort_order' => 2],
                    ['display_value' => 'Green', 'value' => 'green', 'color_code' => '#00FF00', 'sort_order' => 3],
                    ['display_value' => 'Black', 'value' => 'black', 'color_code' => '#000000', 'sort_order' => 4],
                    ['display_value' => 'White', 'value' => 'white', 'color_code' => '#FFFFFF', 'sort_order' => 5],
                    ['display_value' => 'Yellow', 'value' => 'yellow', 'color_code' => '#FFFF00', 'sort_order' => 6],
                    ['display_value' => 'Pink', 'value' => 'pink', 'color_code' => '#FFC0CB', 'sort_order' => 7],
                    ['display_value' => 'Purple', 'value' => 'purple', 'color_code' => '#800080', 'sort_order' => 8],
                ],
            ],
            [
                'name' => 'size',
                'display_name' => 'Size',
                'type' => 'select',
                'is_required' => true,
                'is_visible' => true,
                'sort_order' => 2,
                'options' => [
                    ['display_value' => 'XS', 'value' => 'xs', 'sort_order' => 1],
                    ['display_value' => 'S', 'value' => 's', 'sort_order' => 2],
                    ['display_value' => 'M', 'value' => 'm', 'sort_order' => 3],
                    ['display_value' => 'L', 'value' => 'l', 'sort_order' => 4],
                    ['display_value' => 'XL', 'value' => 'xl', 'sort_order' => 5],
                    ['display_value' => 'XXL', 'value' => 'xxl', 'sort_order' => 6],
                    ['display_value' => '3XL', 'value' => '3xl', 'sort_order' => 7],
                ],
            ],
            [
                'name' => 'material',
                'display_name' => 'Material',
                'type' => 'select',
                'is_required' => false,
                'is_visible' => true,
                'sort_order' => 3,
                'options' => [
                    ['display_value' => 'Cotton', 'value' => 'cotton', 'sort_order' => 1],
                    ['display_value' => 'Polyester', 'value' => 'polyester', 'sort_order' => 2],
                    ['display_value' => 'Wool', 'value' => 'wool', 'sort_order' => 3],
                    ['display_value' => 'Silk', 'value' => 'silk', 'sort_order' => 4],
                    ['display_value' => 'Denim', 'value' => 'denim', 'sort_order' => 5],
                    ['display_value' => 'Linen', 'value' => 'linen', 'sort_order' => 6],
                ],
            ],
        ];

        foreach ($attributes as $attrData) {
            $options = $attrData['options'];
            unset($attrData['options']);

            // Find existing attribute or create new one
            $attribute = Attribute::firstOrCreate(
                ['name' => $attrData['name']],
                $attrData
            );

            // Update attribute with new data in case it already exists
            $attribute->update($attrData);

            // Delete existing options to avoid duplicates
            $attribute->options()->delete();

            // Create new options
            foreach ($options as $optionData) {
                $attribute->options()->create($optionData);
            }
        }
    }
}
