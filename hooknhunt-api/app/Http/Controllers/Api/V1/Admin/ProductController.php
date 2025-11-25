<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::latest()->paginate(15);
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'base_name' => 'required|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'base_thumbnail_url' => 'nullable|url',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        ]);

        $thumbnailUrl = $validated['base_thumbnail_url'] ?? null;
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $thumbnailUrl = Storage::url($thumbnailPath);
        }

        $product = Product::create([
            'base_name' => $validated['base_name'],
            'slug' => Str::slug($validated['base_name']) . '-' . uniqid(),
            'status' => $validated['status'],
            'meta_title' => $validated['base_name'],
            'meta_description' => $validated['meta_description'] ?? null,
            'base_thumbnail_url' => $thumbnailUrl,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Product $product)
    {
        // Handle include parameter to load relationships
        if ($request->has('include')) {
            $includes = $request->get('include');

            // Handle comma-separated includes
            $relationships = explode(',', $includes);

            // Load each requested relationship
            foreach ($relationships as $relationship) {
                $relationship = trim($relationship);

                if ($relationship === 'suppliers') {
                    $product->load('suppliers');

                    // Transform suppliers data to match frontend expectations
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

                    // Convert product to array, replace suppliers, and return as JSON
                    $productArray = $product->toArray();
                    $productArray['suppliers'] = $suppliersArray;
                    return response()->json($productArray);
                }

                // Add more relationship loading here as needed
                // Example: if ($relationship === 'variants') { $product->load('variants'); }
            }
        }

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'base_name' => 'required|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'base_thumbnail_url' => 'nullable|url',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        ]);

        $thumbnailUrl = $validated['base_thumbnail_url'] ?? null;
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $thumbnailUrl = Storage::url($thumbnailPath);
        }

        $product->update([
            'base_name' => $validated['base_name'],
            'slug' => Str::slug($validated['base_name']) . '-' . uniqid(),
            'status' => $validated['status'],
            'meta_title' => $validated['base_name'],
            'meta_description' => $validated['meta_description'] ?? null,
            'base_thumbnail_url' => $thumbnailUrl,
        ]);

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
