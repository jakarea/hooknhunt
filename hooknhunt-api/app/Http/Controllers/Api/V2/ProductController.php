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
     * 3. Create Product (Parent Only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'status' => 'in:draft,published,archived'
        ]);

        DB::beginTransaction();
        try {
            $product = Product::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . time(),
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id,
                'thumbnail_id' => $request->thumbnail_id,
                'gallery_images' => $request->gallery_images, // Array of IDs
                'description' => $request->description,
                'status' => $request->status ?? 'draft',
                'video_url' => $request->video_url
            ]);

            DB::commit();
            return $this->sendSuccess($product, 'Product created successfully. Now add variants.', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Product creation failed', ['error' => $e->getMessage()], 500);
        }
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