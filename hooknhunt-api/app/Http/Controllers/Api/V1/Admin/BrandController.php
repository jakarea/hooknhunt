<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $brands = Brand::withCount('products')
            ->orderBy('name')
            ->get();

        return response()->json($brands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
            'slug' => 'nullable|string|max:255|unique:brands,slug',
            'logo_media_id' => 'nullable|integer|exists:media_files,id',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle logo from media library
        if (!empty($validated['logo_media_id'])) {
            $mediaFile = MediaFile::find($validated['logo_media_id']);
            if ($mediaFile) {
                $validated['logo'] = $mediaFile->path; // Store the relative path
                $validated['logo_media_id'] = $mediaFile->id; // Keep the media ID reference
            } else {
                $validated['logo'] = null;
                $validated['logo_media_id'] = null;
            }
        } else {
            // If no media ID provided, set logo to null
            $validated['logo'] = null;
            $validated['logo_media_id'] = null;
        }

        $brand = Brand::create($validated);

        return response()->json($brand, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand): JsonResponse
    {
        $brand->load(['products' => function ($query) {
            $query->select('id', 'base_name', 'brand_id', 'status', 'base_thumbnail_url')
                  ->with('variants:id,product_id,retail_price,wholesale_price,daraz_price');
        }]);

        return response()->json($brand);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
            'slug' => 'nullable|string|max:255|unique:brands,slug,' . $brand->id,
            'logo_media_id' => 'nullable|integer|exists:media_files,id',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle logo from media library
        if (!empty($validated['logo_media_id'])) {
            $mediaFile = MediaFile::find($validated['logo_media_id']);
            if ($mediaFile) {
                $validated['logo'] = $mediaFile->path; // Store the relative path
                $validated['logo_media_id'] = $mediaFile->id; // Keep the media ID reference
            } else {
                $validated['logo'] = null;
                $validated['logo_media_id'] = null;
            }
        } else {
            // If no media ID provided, set logo to null
            $validated['logo'] = null;
            $validated['logo_media_id'] = null;
        }

        $brand->update($validated);

        return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand): JsonResponse
    {
        // Check if brand has products
        $productCount = $brand->products()->count();
        if ($productCount > 0) {
            return response()->json([
                'message' => 'Cannot delete brand with associated products',
                'products_count' => $productCount
            ], 422);
        }

        // Delete logo if exists
        if ($brand->logo && Storage::disk('public')->exists($brand->logo)) {
            Storage::disk('public')->delete($brand->logo);
        }

        $brand->delete();

        return response()->json(null, 204);
    }
}