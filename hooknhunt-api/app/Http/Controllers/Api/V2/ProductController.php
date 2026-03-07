<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * 1. Product List (With Stock Info)
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'thumbnail', 'variants.batches']);

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhereHas('variants', function($q) use ($request) {
                      $q->where('sku', 'like', "%{$request->search}%");
                  });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        $perPage = $request->per_page ?? 20;
        $page = $request->page ?? 1;

        return $this->sendSuccess($query->paginate($perPage, ['*'], 'page', $page));
    }

    /**
     * 2. Helper: Auto Generate Unique SKU
     */
    public function generateSku(Request $request)
    {
        // Format: CAT-BRAND-RANDOM (e.g., ELEC-SAM-8821)
        $prefix = strtoupper(substr($request->category_name ?? 'GEN', 0, 3));
        $unique = false;
        $sku = '';

        while (!$unique) {
            $sku = $prefix . '-' . rand(10000, 99999);
            if (!ProductVariant::where('sku', $sku)->exists()) {
                $unique = true;
            }
        }

        return $this->sendSuccess(['sku' => $sku]);
    }

    /**
     * 3. Create Product with Multi-Platform Variants
     * POST /api/v2/catalog/products
     */
    public function store(Request $request)
    {
        // Comprehensive validation with custom error messages
        $validated = $request->validate([
            // Product Basic Information
            'productName' => 'required|string|max:255',
            'category' => 'required|integer|exists:categories,id',
            'brand' => 'required|integer|exists:brands,id',
            'status' => 'required|in:draft,published,archived',
            'videoUrl' => 'nullable|url|max:500',

            // Product Settings
            'enableWarranty' => 'boolean',
            'warrantyDetails' => 'nullable|string|max:1000',
            'enablePreorder' => 'boolean',
            'expectedDeliveryDate' => 'nullable|date|after:today',

            // Content
            'description' => 'required|string|min:10',
            'highlights' => 'nullable|array|max:10',
            'highlights.*' => 'string|max:255',
            'includesInTheBox' => 'nullable|array|max:20',
            'includesInTheBox.*' => 'string|max:255',

            // SEO
            'seoTitle' => 'nullable|string|max:60',
            'seoDescription' => 'nullable|string|max:160',
            'seoTags' => 'nullable|string|max:255',

            // Media
            'featuredImage' => 'nullable|integer|exists:media_files,id',
            'galleryImages' => 'nullable|array|max:6',
            'galleryImages.*' => 'integer|exists:media_files,id',

            // Variants (at least one required)
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.sellerSku' => 'nullable|string|max:100',
            'variants.*.purchaseCost' => 'required|numeric|min:0',
            'variants.*.retailPrice' => 'required|numeric|min:0',
            'variants.*.wholesalePrice' => 'required|numeric|min:0',
            'variants.*.retailOfferPrice' => 'nullable|numeric|min:0|lte:variants.*.retailPrice',
            'variants.*.wholesaleOfferPrice' => 'nullable|numeric|min:0|lte:variants.*.wholesalePrice',
            'variants.*.wholesaleMoq' => 'required|integer|min:1',
            'variants.*.weight' => 'required|numeric|min:0|max:999999',
            'variants.*.stock' => 'required|integer|min:0',
        ], [
            // Custom error messages
            'productName.required' => 'Product name is required',
            'category.required' => 'Please select a category',
            'category.exists' => 'Selected category does not exist',
            'brand.required' => 'Please select a brand',
            'brand.exists' => 'Selected brand does not exist',
            'status.in' => 'Status must be draft, published, or archived',
            'videoUrl.url' => 'Video URL must be a valid URL',
            'description.required' => 'Product description is required',
            'description.min' => 'Description must be at least 10 characters',
            'highlights.max' => 'Maximum 10 highlights allowed',
            'includesInTheBox.max' => 'Maximum 20 items allowed in box',
            'seoTitle.max' => 'SEO title must not exceed 60 characters',
            'seoDescription.max' => 'SEO description must not exceed 160 characters',
            'featuredImage.exists' => 'Featured image does not exist',
            'galleryImages.max' => 'Maximum 6 gallery images allowed',
            'variants.required' => 'At least one variant is required',
            'variants.min' => 'At least one variant is required',
            'variants.*.name.required' => 'Variant name is required',
            'variants.*.retailPrice.required' => 'Retail price is required',
            'variants.*.wholesalePrice.required' => 'Wholesale price is required',
            'variants.*.purchaseCost.required' => 'Purchase cost is required',
            'variants.*.retailOfferPrice.lte' => 'Retail offer price cannot be higher than retail price',
            'variants.*.wholesaleOfferPrice.lte' => 'Wholesale offer price cannot be higher than wholesale price',
        ]);

        DB::beginTransaction();
        try {
            // 1. Create Product
            $product = Product::create([
                'name' => $validated['productName'],
                'slug' => Str::slug($validated['productName']) . '-' . time(),
                'category_id' => $validated['category'],
                'brand_id' => $validated['brand'],
                'status' => $validated['status'],
                'video_url' => $validated['videoUrl'],
                'warranty_enabled' => $validated['enableWarranty'],
                'warranty_details' => $validated['warrantyDetails'],
                'description' => $validated['description'],
                'highlights' => $validated['highlights'],
                'includes_in_box' => $validated['includesInTheBox'],
                'seo_title' => $validated['seoTitle'],
                'seo_description' => $validated['seoDescription'],
                'seo_tags' => $validated['seoTags'] ? explode(',', $validated['seoTags']) : null,
                'thumbnail_id' => $validated['featuredImage'],
                'gallery_images' => $validated['galleryImages'],
            ]);

            // 2. Create Variants - TWO ROWS PER VARIANT (Retail + Wholesale)
            $createdVariants = [];

            foreach ($validated['variants'] as $index => $variant) {
                $baseSku = $variant['sellerSku'] ?? $this->generateSkuFromNames($product->name, $variant['name']);

                // RETAIL VARIANT ROW
                $retailVariant = ProductVariant::create([
                    'product_id' => $product->id,
                    'channel' => 'retail',
                    'custom_name' => $variant['name'],
                    'variant_slug' => Str::slug($variant['name'] . '-retail'),
                    'variant_name' => $variant['name'],
                    'sku' => $baseSku . '-R-' . rand(1000, 9999),
                    'custom_sku' => $variant['sellerSku'],
                    'purchase_cost' => $variant['purchaseCost'],
                    'price' => $variant['retailPrice'],
                    'offer_price' => $variant['retailOfferPrice'] ?? 0,
                    'moq' => $variant['wholesaleMoq'],
                    'weight' => $variant['weight'],
                    'stock' => $variant['stock'],
                    'allow_preorder' => $validated['enablePreorder'],
                    'expected_delivery' => $validated['expectedDeliveryDate'],
                    'is_active' => true,
                ]);

                $createdVariants[] = $retailVariant;

                // WHOLESALE VARIANT ROW
                $wholesaleVariant = ProductVariant::create([
                    'product_id' => $product->id,
                    'channel' => 'wholesale',
                    'custom_name' => $variant['name'],
                    'variant_slug' => Str::slug($variant['name'] . '-wholesale'),
                    'variant_name' => $variant['name'],
                    'sku' => $baseSku . '-W-' . rand(1000, 9999),
                    'custom_sku' => $variant['sellerSku'],
                    'purchase_cost' => $variant['purchaseCost'],
                    'price' => $variant['wholesalePrice'],
                    'offer_price' => $variant['wholesaleOfferPrice'] ?? 0,
                    'moq' => $variant['wholesaleMoq'],
                    'weight' => $variant['weight'],
                    'stock' => $variant['stock'],
                    'allow_preorder' => $validated['enablePreorder'],
                    'expected_delivery' => $validated['expectedDeliveryDate'],
                    'is_active' => true,
                ]);

                $createdVariants[] = $wholesaleVariant;
            }

            DB::commit();

            return $this->sendSuccess([
                'product' => $product,
                'variants' => $createdVariants,
                'total_variants' => count($createdVariants)
            ], 'Product created successfully with ' . count($createdVariants) . ' variants (2 per platform)', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return $this->sendError('Validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Product creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->sendError('Product creation failed', [
                'error' => 'An error occurred while creating the product. Please try again.',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Helper: Generate SKU from product and variant names
     */
    private function generateSkuFromNames($productName, $variantName)
    {
        $productCode = strtoupper(substr(Str::slug($productName), 0, 3));
        $variantCode = strtoupper(substr(Str::slug($variantName), 0, 3));
        return $productCode . '-' . $variantCode;
    }

    /**
     * 4. Add Variant (The SKU)
     */
    public function storeVariant(Request $request, $id)
    {
        $request->validate([
            'sku' => 'required|unique:product_variants,sku',
            'price' => 'required|numeric',
            'unit_id' => 'required|exists:units,id'
        ]);

        $product = Product::findOrFail($id);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => $request->sku,
            'custom_sku' => $request->custom_sku, // Owner's secret code
            'variant_name' => $request->variant_name, // e.g. "Red - XL"
            'size' => $request->size,
            'color' => $request->color,
            'unit_id' => $request->unit_id,
            'default_retail_price' => $request->price,
            'default_purchase_cost' => $request->cost ?? 0,
            'stock_alert_level' => $request->alert_qty ?? 5,
        ]);

        return $this->sendSuccess($variant, 'Variant added successfully', 201);
    }

    public function show($id)
    {
        // Load variants and their specific channel prices
        return $this->sendSuccess(
            Product::with(['variants.channelSettings', 'category', 'brand', 'thumbnail'])->findOrFail($id)
        );
    }

    /**
     * Link Supplier to Product
     * Route: POST /api/v2/products/{id}/suppliers
     */
    // Method: addSupplier

    public function addSupplier(Request $request, $id)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'product_links' => 'nullable|array', // Must be an array
            'product_links.*' => 'url', // Each item must be a valid URL
            'cost_price' => 'nullable|numeric'
        ]);

        $product = Product::findOrFail($id);

        // Sync without detaching
        // Laravel automatically converts the array to JSON for the DB
        $product->suppliers()->syncWithoutDetaching([
            $request->supplier_id => [
                'product_links' => json_encode($request->product_links), // Explicit encode helps avoid issues
                'cost_price' => $request->cost_price
            ]
        ]);

        return $this->sendSuccess($product->load('suppliers'), 'Supplier linked with multiple URLs');
    }

    /**
     * Update Product
     * PUT/PATCH /api/v2/catalog/products/{id}
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'status' => 'in:draft,published,archived'
        ]);

        $product = Product::findOrFail($id);

        DB::beginTransaction();
        try {
            $product->update([
                'name' => $request->name ?? $product->name,
                'slug' => $request->name ? Str::slug($request->name) . '-' . time() : $product->slug,
                'category_id' => $request->category_id ?? $product->category_id,
                'brand_id' => $request->brand_id ?? $product->brand_id,
                'thumbnail_id' => $request->thumbnail_id ?? $product->thumbnail_id,
                'gallery_images' => $request->gallery_images ?? $product->gallery_images,
                'description' => $request->description ?? $product->description,
                'status' => $request->status ?? $product->status,
                'video_url' => $request->video_url ?? $product->video_url
            ]);

            DB::commit();
            return $this->sendSuccess($product->load(['category', 'brand', 'thumbnail']), 'Product updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Product update failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete Product (Soft Delete)
     * DELETE /api/v2/catalog/products/{id}
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        DB::beginTransaction();
        try {
            $product->delete();
            DB::commit();
            return $this->sendSuccess(null, 'Product deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Product deletion failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Duplicate Product
     * POST /api/v2/catalog/products/{id}/duplicate
     */
    public function duplicate($id)
    {
        $product = Product::with(['variants', 'category', 'brand', 'thumbnail'])->findOrFail($id);

        DB::beginTransaction();
        try {
            // Create new product from existing
            $newProduct = Product::create([
                'name' => $product->name . ' (Copy)',
                'slug' => Str::slug($product->name) . '-copy-' . time(),
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'thumbnail_id' => $product->thumbnail_id,
                'gallery_images' => $product->gallery_images,
                'description' => $product->description,
                'status' => 'draft', // Always start as draft
                'video_url' => $product->video_url
            ]);

            // Duplicate variants
            foreach ($product->variants as $variant) {
                $newVariant = $variant->replicate();
                $newVariant->product_id = $newProduct->id;
                $newVariant->sku = $variant->sku . '-COPY';
                $newVariant->save();
            }

            DB::commit();
            return $this->sendSuccess($newProduct->load(['variants', 'category', 'brand', 'thumbnail']), 'Product duplicated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Product duplication failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Quick Status Change
     * PATCH /api/v2/catalog/products/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:draft,published,archived'
        ]);

        $product = Product::findOrFail($id);
        $product->update(['status' => $request->status]);

        return $this->sendSuccess($product, 'Product status updated successfully');
    }
}