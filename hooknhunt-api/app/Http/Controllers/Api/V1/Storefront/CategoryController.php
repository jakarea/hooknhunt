<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories with hierarchical structure and product counts
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Get all categories
        $categories = Category::all();

        // Pre-compute product counts for all categories
        $categoryProductCounts = [];
        foreach ($categories as $category) {
            $categoryProductCounts[$category->id] = $this->getProductCountForCategory($category->id);
        }

        // Sort categories by product count (descending)
        $allCategories = $categories->sortBy(function ($category) use ($categoryProductCounts) {
            return -($categoryProductCounts[$category->id] ?? 0); // Negative for descending order
        })->values();

        // Build hierarchical structure for root categories only, sorted by product count
        $rootCategories = $categories->where('parent_id', null)
            ->sortBy(function ($category) use ($categoryProductCounts) {
                return -($categoryProductCounts[$category->id] ?? 0); // Negative for descending order
            })->values();

        $categoryTree = [];

        foreach ($rootCategories as $rootCategory) {
            $categoryTree[] = [
                'id' => $rootCategory->id,
                'name' => $rootCategory->name,
                'slug' => $rootCategory->slug,
                'image_url' => $rootCategory->image_url,
                'product_count' => $categoryProductCounts[$rootCategory->id] ?? 0,
                'children' => $this->buildChildren($rootCategory->id, $categories, $categoryProductCounts)
            ];
        }

        return response()->json([
            'categories' => $categoryTree,
            'all_categories' => $allCategories->map(function ($category) use ($categoryProductCounts) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent_id' => $category->parent_id,
                    'image_url' => $category->image_url,
                    'product_count' => $categoryProductCounts[$category->id] ?? 0,
                ];
            })
        ]);
    }

    /**
     * Get a single category by slug
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        // Get children categories with product counts
        $children = Category::where('parent_id', $category->id)
            ->orderBy('name')
            ->get()
            ->map(function ($child) {
                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'image_url' => $child->image_url,
                    'product_count' => $this->getProductCountForCategory($child->id),
                ];
            });

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image_url' => $category->image_url,
                'product_count' => $this->getProductCountForCategory($category->id),
                'children' => $children
            ]
        ]);
    }

    /**
     * Get featured/top-level categories only, ordered by product count
     *
     * @return JsonResponse
     */
    public function featured(): JsonResponse
    {
        $categories = Category::where('parent_id', null)
            ->get()
            ->sortBy(function ($category) {
                return -$this->getProductCountForCategory($category->id); // Negative for descending order
            })
            ->values()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image_url' => $category->image_url,
                    'product_count' => $this->getProductCountForCategory($category->id),
                ];
            });

        return response()->json($categories);
    }

    /**
     * Build children categories recursively
     *
     * @param int $parentId
     * @param \Illuminate\Database\Eloquent\Collection $allCategories
     * @param array $categoryProductCounts
     * @return array
     */
    private function buildChildren(int $parentId, $allCategories, array $categoryProductCounts): array
    {
        $children = $allCategories->where('parent_id', $parentId)
            ->sortBy(function ($child) use ($categoryProductCounts) {
                return -($categoryProductCounts[$child->id] ?? 0); // Negative for descending order
            })
            ->values();

        $result = [];

        foreach ($children as $child) {
            $result[] = [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'image_url' => $child->image_url,
                'product_count' => $categoryProductCounts[$child->id] ?? 0,
                'children' => $this->buildChildren($child->id, $allCategories, $categoryProductCounts)
            ];
        }

        return $result;
    }

    /**
     * Get product count for a specific category
     *
     * @param int $categoryId
     * @return int
     */
    private function getProductCountForCategory(int $categoryId): int
    {
        // Count of published products in this category
        // category_ids is stored as a JSON string like "[1,2,3]" in the database
        // We need to match the pattern: [,1,] or [1,] or [,1] or [1]
        $patterns = [
            '[' . $categoryId . ',',  // At start: [1,
            ',' . $categoryId . ',',  // In middle: ,1,
            ',' . $categoryId . ']',  // At end: ,1]
            '[' . $categoryId . ']'   // Only one: [1]
        ];

        $count = Product::where('status', 'published')
            ->where(function ($query) use ($patterns) {
                foreach ($patterns as $pattern) {
                    $query->orWhere('category_ids', 'LIKE', '%' . $pattern . '%');
                }
            })
            ->count();

        return $count;
    }
}