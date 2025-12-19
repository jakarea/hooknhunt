<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\MediaFile;
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
            'media_file_id' => 'nullable|integer|exists:media_files,id', // for media library selection
            'gallery_images.*' => 'nullable|file|image|max:500', // 500KB max each
        ]);

        // Handle thumbnail from media library or direct URL
        $thumbnailUrl = $validated['base_thumbnail_url'] ?? null;

        if ($request->has('media_file_id')) {
            // Media library selection
            $mediaFile = MediaFile::find($request->media_file_id);
            if ($mediaFile) {
                $thumbnailUrl = $mediaFile->path;
                // Record usage in media file
                $mediaFile->recordUsage('product', 0); // Will be updated with actual product ID after creation
            }
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

        // Update media file usage with actual product ID
        if (isset($mediaFile) && $product) {
            $mediaFile->recordUsage('product', $product->id);
        }

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
        try {
            $validated = $request->validate([
                'base_name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'category_ids' => 'nullable|array',
                'category_ids.*' => 'integer|exists:categories,id',
                'status' => 'nullable|in:draft,published',
                'base_thumbnail_url' => 'nullable|url',
                'video_url' => 'nullable|url',
                'gallery_images' => 'nullable|string', // JSON string of URLs (from frontend FormData)
                'existing_gallery_images' => 'nullable|string', // JSON string (for compatibility)
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

            if (isset($validated['base_thumbnail_url'])) {
                $updateData['base_thumbnail_url'] = $validated['base_thumbnail_url'];
            }

            if (isset($validated['video_url'])) {
                $updateData['video_url'] = $validated['video_url'];
            }

            // Handle gallery images
            $galleryImages = [];

            // Debug: Log what we received
            \Log::info('Gallery images input:', [
                'request_has_gallery_images' => $request->has('gallery_images'),
                'validated_gallery_images' => $validated['gallery_images'] ?? 'not_set',
                'gallery_images_input' => $request->input('gallery_images'),
                'all_request_data' => $request->all()
            ]);

            // Handle gallery_images as JSON string (from frontend FormData)
            if ($request->has('gallery_images') && isset($validated['gallery_images'])) {
                $decodedImages = json_decode($validated['gallery_images'], true);
                if (is_array($decodedImages)) {
                    $galleryImages = $decodedImages;
                    \Log::info('Gallery images from JSON string:', $galleryImages);
                }
            }

            // Handle existing_gallery_images for backward compatibility
            if ($request->has('existing_gallery_images')) {
                $existingImages = json_decode($request->get('existing_gallery_images'), true);
                if (is_array($existingImages)) {
                    // Merge with any existing URLs
                    $galleryImages = array_merge($galleryImages, $existingImages);
                    \Log::info('Gallery images after merging with existing:', $galleryImages);
                }
            }

            // Always update gallery_images if provided (even if empty - allows clearing gallery)
            if ($request->has('gallery_images') || $request->has('existing_gallery_images')) {
                $updateData['gallery_images'] = $galleryImages;
                \Log::info('Update data includes gallery_images:', $updateData['gallery_images']);
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

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Product update validation failed:', $e->errors());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Product update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get product variants with optional inventory data
     */
    public function variants(Request $request)
    {
        $query = \App\Models\ProductVariant::with(['product', 'inventory']);

        // Filter by inventory data if requested
        if ($request->get('with_inventory') === 'true') {
            $query->whereHas('inventory');
        }

        $variants = $query->get();

        $transformedVariants = [];
        foreach ($variants as $variant) {
            // Get the first inventory record (since it's hasMany relationship)
            $inventory = $variant->inventory->first();
            $availableQuantity = $inventory ? ($inventory->quantity - $inventory->reserved_quantity) : 0;

            $transformedVariants[] = [
                'id' => $variant->id,
                'sku' => $variant->sku ?? 'N/A',
                'retail_name' => $variant->retail_name ?? 'N/A',
                'wholesale_name' => $variant->wholesale_name ?? 'N/A',
                'daraz_name' => $variant->daraz_name ?? 'N/A',
                'landed_cost' => (float) ($variant->landed_cost ?? 0),
                'retail_price' => (float) ($variant->retail_price ?? 0),
                'wholesale_price' => (float) ($variant->wholesale_price ?? 0),
                'daraz_price' => (float) ($variant->daraz_price ?? 0),
                'retail_offer_discount_type' => $variant->retail_offer_discount_type,
                'retail_offer_discount_value' => (float) ($variant->retail_offer_discount_value ?? 0),
                'wholesale_offer_discount_type' => $variant->wholesale_offer_discount_type,
                'wholesale_offer_discount_value' => (float) ($variant->wholesale_offer_discount_value ?? 0),
                'daraz_offer_discount_type' => $variant->daraz_offer_discount_type,
                'daraz_offer_discount_value' => (float) ($variant->daraz_offer_discount_value ?? 0),
                'retail_offer_start_date' => $variant->retail_offer_start_date,
                'retail_offer_end_date' => $variant->retail_offer_end_date,
                'wholesale_offer_start_date' => $variant->wholesale_offer_start_date,
                'wholesale_offer_end_date' => $variant->wholesale_offer_end_date,
                'daraz_offer_start_date' => $variant->daraz_offer_start_date,
                'daraz_offer_end_date' => $variant->daraz_offer_end_date,
                'status' => $variant->status ?? 'active',
                'product' => $variant->product ? [
                    'id' => $variant->product->id,
                    'base_name' => $variant->product->base_name ?? 'Unknown Product',
                    'base_thumbnail_url' => $variant->product->base_thumbnail_url,
                ] : null,
                'inventory' => $inventory ? [
                    'id' => $inventory->id,
                    'quantity' => (int) $inventory->quantity,
                    'reserved_quantity' => (int) $inventory->reserved_quantity,
                    'min_stock_level' => (int) $inventory->min_stock_level,
                    'available_quantity' => $availableQuantity,
                ] : null,
            ];
        }

        return response()->json($transformedVariants);
    }

    /**
     * Update a product variant
     */
    public function updateVariant(Request $request, $id)
    {
        $variant = \App\Models\ProductVariant::findOrFail($id);

        $validated = $request->validate([
            'sku' => 'required|string|max:255|unique:product_variants,sku,' . $id,
            'landed_cost' => 'required|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'wholesale_price' => 'nullable|numeric|min:0',
            'daraz_price' => 'nullable|numeric|min:0',
            'retail_name' => 'nullable|string|max:255',
            'wholesale_name' => 'nullable|string|max:255',
            'daraz_name' => 'nullable|string|max:255',
            // Offer discount fields
            'retail_offer_discount_type' => 'nullable|in:flat,percentage',
            'retail_offer_discount_value' => 'nullable|numeric|min:0',
            'wholesale_offer_discount_type' => 'nullable|in:flat,percentage',
            'wholesale_offer_discount_value' => 'nullable|numeric|min:0',
            'daraz_offer_discount_type' => 'nullable|in:flat,percentage',
            'daraz_offer_discount_value' => 'nullable|numeric|min:0',
            'retail_offer_start_date' => 'nullable|date',
            'retail_offer_end_date' => 'nullable|date|after_or_equal:retail_offer_start_date',
            'wholesale_offer_start_date' => 'nullable|date',
            'wholesale_offer_end_date' => 'nullable|date|after_or_equal:wholesale_offer_start_date',
            'daraz_offer_start_date' => 'nullable|date',
            'daraz_offer_end_date' => 'nullable|date|after_or_equal:daraz_offer_start_date',
        ]);

        $variant->update($validated);

        return response()->json([
            'message' => 'Product variant updated successfully',
            'data' => $variant->fresh()
        ]);
    }

    /**
     * Upload a single gallery image and return URL
     */
    public function uploadGalleryImage(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|image|max:5000', // 5MB max
        ]);

        try {
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $file = $validated['image'];
                $originalFilename = $file->getClientOriginalName();
                $filename = MediaFile::generateUniqueFilename($originalFilename);
                $mimeType = $file->getMimeType();
                $extension = $file->getClientOriginalExtension();
                $sizeBytes = $file->getSize();

                // Generate hash for deduplication
                $hash = hash_file('sha256', $file->getPathname());

                // Check for duplicate files
                $existingMedia = MediaFile::where('hash', $hash)->first();
                if ($existingMedia) {
                    return response()->json([
                        'success' => true,
                        'url' => $existingMedia->full_url,
                        'media_file_id' => $existingMedia->id,
                        'duplicate' => true
                    ]);
                }

                // Determine storage path and store file
                $storagePath = "media/images/" . now()->format('Y/m');
                $storedPath = $file->storeAs($storagePath, $filename, 'public');
                $url = Storage::disk('public')->url($storedPath);

                // Get image dimensions
                $width = null;
                $height = null;
                if (str_starts_with($mimeType, 'image/')) {
                    try {
                        $imageInfo = getimagesize(storage_path('app/public/' . $storedPath));
                        if ($imageInfo) {
                            $width = $imageInfo[0];
                            $height = $imageInfo[1];
                        }
                    } catch (\Exception $e) {
                        // Continue without dimensions
                    }
                }

                // Create media file record
                $mediaFile = MediaFile::create([
                    'filename' => $filename,
                    'original_filename' => $originalFilename,
                    'mime_type' => $mimeType,
                    'extension' => $extension,
                    'size_bytes' => $sizeBytes,
                    'width' => $width,
                    'height' => $height,
                    'disk' => 'public',
                    'path' => $storedPath,
                    'url' => $url,
                    'hash' => $hash,
                    'uploaded_by_user_id' => Auth::id(),
                ]);

                return response()->json([
                    'success' => true,
                    'url' => $url,
                    'media_file_id' => $mediaFile->id,
                    'duplicate' => false
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid file'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Gallery image upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product media (images and video)
     */
    public function updateMedia(Request $request, Product $product)
    {
        $validated = $request->validate([
            'video_url' => 'nullable|url',
            'gallery_images.*' => 'nullable|file|image|max:500', // 500KB max each
            'existing_gallery_images' => 'nullable|string', // JSON string
        ]);

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
            $galleryFiles = $request->file('gallery_images');

            // Handle both array and single file cases
            if (is_array($galleryFiles)) {
                foreach ($galleryFiles as $file) {
                    if ($file && $file->isValid()) {
                        $path = $file->store('gallery', 'public');
                        $url = Storage::url($path);
                        // Fix double storage path issue
                        $url = str_replace('/storage/storage/', '/storage/', $url);
                        $galleryImages[] = $url;
                    }
                }
            } elseif ($galleryFiles && $galleryFiles->isValid()) {
                $path = $galleryFiles->store('gallery', 'public');
                $url = Storage::url($path);
                // Fix double storage path issue
                $url = str_replace('/storage/storage/', '/storage/', $url);
                $galleryImages[] = $url;
            }
        }

        // Update fields only if provided
        $updateData = [];

        if (isset($validated['video_url'])) {
            $updateData['video_url'] = $validated['video_url'];
        }

        // Update gallery images
        if (!empty($galleryImages) || $request->has('existing_gallery_images')) {
            $updateData['gallery_images'] = $galleryImages;
        }

        // Update product
        $product->update($updateData);

        return response()->json([
            'message' => 'Product media updated successfully',
            'data' => $product->fresh()
        ]);
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