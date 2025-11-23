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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'category_id' => 'nullable|integer|exists:categories,id',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        ]);

        $thumbnailUrl = null;
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $thumbnailUrl = Storage::url($thumbnailPath);
        }

        $product = Product::create([
            'base_name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . uniqid(),
            'status' => $validated['status'],
            'meta_title' => $validated['name'],
            'meta_description' => $validated['description'] ?? null,
            'base_thumbnail_url' => $thumbnailUrl,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'category_id' => 'nullable|integer|exists:categories,id',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        ]);

        $product->update([
            'base_name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . uniqid(),
            'status' => $validated['status'],
            'meta_title' => $validated['name'],
            'meta_description' => $validated['description'],
            'base_thumbnail_url' => $validated['thumbnail'],
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
