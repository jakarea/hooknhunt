<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Handle search parameter
        if ($request->has('search')) {
            $searchTerm = $request->get('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('base_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('slug', 'like', '%' . $searchTerm . '%')
                  ->orWhere('meta_title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('meta_description', 'like', '%' . $searchTerm . '%');
            });
        }

        // Handle category_ids filter
        if ($request->has('category_ids')) {
            $categoryIds = $request->get('category_ids');

            // Convert to array if it's a string
            if (is_string($categoryIds)) {
                $categoryIds = [$categoryIds];
            }

            if (is_array($categoryIds) && !empty($categoryIds)) {
                // Filter using JSON field - check if any of the category_ids exist in the product's category_ids array
                $query->where(function($q) use ($categoryIds) {
                    foreach ($categoryIds as $categoryId) {
                        $q->orWhereJsonContains('category_ids', (int)$categoryId);
                    }
                });
            }
        }

        // Handle supplier filter
        if ($request->has('supplier_id')) {
            $query->whereHas('suppliers', function($q) use ($request) {
                $q->where('suppliers.id', $request->get('supplier_id'));
            });
        }

        // Handle include parameter to load relationships
        $includeCategories = false;
        $includeSuppliers = false;

        if ($request->has('include')) {
            $includes = explode(',', $request->get('include'));
            foreach ($includes as $include) {
                $include = trim($include);
                if ($include === 'categories') {
                    $includeCategories = true;
                } elseif (in_array($include, ['suppliers'])) {
                    $includeSuppliers = true;
                    $query->with($include);
                }
            }
        }

        $products = $query->latest()->paginate(10);

        // If categories are requested, append them to each product
        if ($includeCategories) {
            $products->getCollection()->transform(function ($product) {
                $productArray = $product->toArray();
                try {
                    $categories = $product->categories;
                    if ($categories && $categories->count() > 0) {
                        $productArray['categories'] = $categories->toArray();
                    } else {
                        $productArray['categories'] = [];
                    }
                } catch (\Exception $e) {
                    // Log the error but don't break the response
                    \Log::error('Error loading categories for product ' . $product->id . ': ' . $e->getMessage());
                    $productArray['categories'] = [];
                }
                return $productArray;
            });
        }

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'base_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'status' => 'required|in:draft,published',
            'base_thumbnail_url' => 'nullable|url',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
            'gallery_images.*' => 'nullable|file|image|max:500', // 500KB max each
        ]);

        $thumbnailUrl = $validated['base_thumbnail_url'] ?? null;
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $thumbnailUrl = Storage::url($thumbnailPath);
        }

        // Handle gallery images
        $galleryImages = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('gallery', 'public');
                    $galleryImages[] = Storage::url($path);
                }
            }
        }

        $product = Product::create([
            'base_name' => $validated['base_name'],
            'slug' => Str::slug($validated['base_name']) . '-' . uniqid(),
            'status' => $validated['status'],
            'meta_title' => $validated['meta_title'] ?? $validated['base_name'],
            'meta_description' => $validated['meta_description'] ?? $validated['description'] ?? null,
            'description' => $validated['description'] ?? null,
            'category_ids' => $validated['category_ids'] ?? [],
            'base_thumbnail_url' => $thumbnailUrl,
            'gallery_images' => !empty($galleryImages) ? $galleryImages : null,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Product $product)
    {
        // Handle include parameter to load relationships
        $includeCategories = false;
        if ($request->has('include')) {
            $includes = $request->get('include');

            // Handle comma-separated includes
            $relationships = explode(',', $includes);

            // Load each requested relationship
            foreach ($relationships as $relationship) {
                $relationship = trim($relationship);

                if ($relationship === 'categories') {
                    $includeCategories = true;
                } elseif ($relationship === 'suppliers') {
                    $product->load('suppliers');
                }
            }
        }

        // Convert product to array and append requested data
        $productArray = $product->toArray();

        // Transform suppliers data if loaded
        if ($product->relationLoaded('suppliers')) {
            $suppliersArray = [];
            foreach ($product->suppliers as $supplier) {
                $supplierArray = $supplier->toArray();

                // Extract URLs from pivot and decode JSON
                $urls = [];
                if (isset($supplierArray['pivot']['supplier_product_urls'])) {
                    $decodedUrls = json_decode($supplierArray['pivot']['supplier_product_urls'], true);
                    $urls = is_array($decodedUrls) ? $decodedUrls : [];
                }

                // Transform to match frontend ProductSupplier interface
                $suppliersArray[] = [
                    'supplier_id' => (int)$supplierArray['id'],
                    'supplier_product_urls' => $urls,
                    'supplier' => [
                        'id' => (int)$supplierArray['id'],
                        'name' => $supplierArray['name'] ?? 'Unknown Supplier',
                        'shop_name' => $supplierArray['shop_name'] ?? null,
                        'email' => $supplierArray['email'] ?? null,
                    ]
                ];
            }
            $productArray['suppliers'] = $suppliersArray;
        }

        // Append categories if requested
        if ($includeCategories) {
            $productArray['categories'] = $product->categories->toArray();
        }

        return response()->json($productArray);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'base_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'status' => 'nullable|in:draft,published',
            'base_thumbnail_url' => 'nullable|url',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
            'gallery_images.*' => 'nullable|file|image|max:500', // 500KB max each
            'existing_gallery_images' => 'nullable|string', // JSON string
        ]);

        // Update fields only if provided
        $updateData = [];

        if (isset($validated['base_name'])) {
            $updateData['base_name'] = $validated['base_name'];
            $updateData['meta_title'] = $validated['meta_title'] ?? $validated['base_name'];
        }

        if (isset($validated['meta_title'])) {
            $updateData['meta_title'] = $validated['meta_title'];
        }

        if (isset($validated['status'])) {
            $updateData['status'] = $validated['status'];
        }

        if (isset($validated['meta_description'])) {
            $updateData['meta_description'] = $validated['meta_description'];
        }

        if (isset($validated['description'])) {
            $updateData['description'] = $validated['description'];
        }

        if (isset($validated['category_id'])) {
            $updateData['category_id'] = $validated['category_id'];
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $updateData['base_thumbnail_url'] = Storage::url($thumbnailPath);
        }

        // Handle gallery images
        $galleryImages = [];

        // Keep existing gallery images if provided
        if ($request->has('existing_gallery_images')) {
            $existingImages = json_decode($request->get('existing_gallery_images'), true);
            if (is_array($existingImages)) {
                $galleryImages = $existingImages;
            }
        }

        // Add new gallery images
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('gallery', 'public');
                    $galleryImages[] = Storage::url($path);
                }
            }
        }

        // Only update gallery_images if we have images or if existing_gallery_images was sent (even if empty)
        if (!empty($galleryImages) || $request->has('existing_gallery_images')) {
            $updateData['gallery_images'] = $galleryImages;
        }

        // Update product
        $product->update($updateData);

        // Handle category_ids (multiple categories)
        if ($request->has('category_ids')) {
            $categoryIds = $validated['category_ids'] ?? [];
            if (is_array($categoryIds)) {
                // Update category_ids field directly
                $product->category_ids = $categoryIds;
                $product->save();
            }
        }

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}
