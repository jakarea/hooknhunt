<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories with hierarchical structure
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Get all categories ordered by name
        $categories = Category::orderBy('name')->get();

        // Build hierarchical structure
        $rootCategories = $categories->where('parent_id', null);
        $categoryTree = [];

        foreach ($rootCategories as $rootCategory) {
            $categoryTree[] = [
                'id' => $rootCategory->id,
                'name' => $rootCategory->name,
                'slug' => $rootCategory->slug,
                'image_url' => $rootCategory->image_url ? url('storage/' . $rootCategory->image_url) : null,
                'children' => $this->buildChildren($rootCategory->id, $categories)
            ];
        }

        return response()->json([
            'categories' => $categoryTree,
            'all_categories' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent_id' => $category->parent_id,
                    'image_url' => $category->image_url ? url('storage/' . $category->image_url) : null,
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

        // Get children categories
        $children = Category::where('parent_id', $category->id)
            ->orderBy('name')
            ->get()
            ->map(function ($child) {
                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'image_url' => $child->image_url ? url('storage/' . $child->image_url) : null,
                ];
            });

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image_url' => $category->image_url ? url('storage/' . $category->image_url) : null,
                'children' => $children
            ]
        ]);
    }

    /**
     * Get featured/top-level categories only
     *
     * @return JsonResponse
     */
    public function featured(): JsonResponse
    {
        $categories = Category::where('parent_id', null)
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image_url' => $category->image_url ? url('storage/' . $category->image_url) : null,
                ];
            });

        return response()->json($categories);
    }

    /**
     * Build children categories recursively
     *
     * @param int $parentId
     * @param \Illuminate\Database\Eloquent\Collection $allCategories
     * @return array
     */
    private function buildChildren(int $parentId, $allCategories): array
    {
        $children = $allCategories->where('parent_id', $parentId);
        $result = [];

        foreach ($children as $child) {
            $result[] = [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'image_url' => $child->image_url ? url('storage/' . $child->image_url) : null,
                'children' => $this->buildChildren($child->id, $allCategories)
            ];
        }

        return $result;
    }
}