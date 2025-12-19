<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryController extends Controller
{
    /**
     * Get paginated inventory list with filters
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Inventory::with([
            'productVariant.product.category',
            'productVariant.product.brand',
            'productVariant.attributeOptions.attribute'
        ]);

        // Filter by product ID
        if ($request->has('product_id')) {
            $query->whereHas('productVariant', function ($q) use ($request) {
                $q->where('product_id', $request->product_id);
            });
        }

        // Filter by SKU (partial match)
        if ($request->has('sku')) {
            $query->whereHas('productVariant', function ($q) use ($request) {
                $q->where('sku', 'like', '%' . $request->sku . '%');
            });
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter by stock status
        if ($request->has('stock_status')) {
            $status = $request->stock_status;

            if ($status === 'out_of_stock') {
                $query->where('quantity', '<=', 0);
            } elseif ($status === 'low_stock') {
                $query->whereColumn('quantity', '<=', 'min_stock_level')
                      ->where('quantity', '>', 0);
            } elseif ($status === 'reorder_needed') {
                $query->whereColumn('quantity', '<=', 'reorder_point')
                      ->where('quantity', '>', 0);
            } elseif ($status === 'in_stock') {
                $query->where('quantity', '>', 0)
                      ->where(function ($q) {
                          $q->whereNull('min_stock_level')
                            ->orWhereColumn('quantity', '>', 'min_stock_level');
                      });
            }
        }

        // Search by product name
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('productVariant.product', function ($q) use ($search) {
                $q->where('base_name', 'like', '%' . $search . '%');
            });
        }

        // Sort options
        $sortBy = $request->input('sort_by', 'updated_at');
        $sortOrder = $request->input('sort_order', 'desc');

        switch ($sortBy) {
            case 'quantity':
                $query->orderBy('quantity', $sortOrder);
                break;
            case 'total_value':
                $query->orderBy('total_value', $sortOrder);
                break;
            case 'product_name':
                $query->join('product_variants', 'inventory.product_variant_id', '=', 'product_variants.id')
                      ->join('products', 'product_variants.product_id', '=', 'products.id')
                      ->orderBy('products.base_name', $sortOrder)
                      ->select('inventory.*');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->input('per_page', 20);
        $inventory = $query->paginate($perPage);

        // Add computed attributes to each item
        $inventory->getCollection()->transform(function ($item) {
            $item->available_quantity = $item->available_quantity;
            $item->stock_status = $item->stock_status;
            $item->is_low_stock = $item->is_low_stock;
            $item->should_reorder = $item->should_reorder;
            return $item;
        });

        return response()->json($inventory);
    }

    /**
     * Get inventory statistics/summary
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_items' => Inventory::count(),
            'total_value' => Inventory::sum('total_value'),
            'out_of_stock' => Inventory::where('quantity', '<=', 0)->count(),
            'low_stock' => Inventory::whereColumn('quantity', '<=', 'min_stock_level')
                                   ->where('quantity', '>', 0)
                                   ->count(),
            'reorder_needed' => Inventory::whereColumn('quantity', '<=', 'reorder_point')
                                        ->where('quantity', '>', 0)
                                        ->count(),
            'total_quantity' => Inventory::sum('quantity'),
            'total_reserved' => Inventory::sum('reserved_quantity'),
        ];

        return response()->json($stats);
    }

    /**
     * Get inventory details for a specific variant
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $inventory = Inventory::with([
            'productVariant.product.category',
            'productVariant.product.brand',
            'productVariant.attributeOptions.attribute'
        ])->findOrFail($id);

        $inventory->available_quantity = $inventory->available_quantity;
        $inventory->stock_status = $inventory->stock_status;
        $inventory->is_low_stock = $inventory->is_low_stock;
        $inventory->should_reorder = $inventory->should_reorder;

        return response()->json($inventory);
    }

    /**
     * Update inventory settings (min/max levels, location, etc.)
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'min_stock_level' => 'nullable|integer|min:0',
            'max_stock_level' => 'nullable|integer|min:0',
            'reorder_point' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:100',
        ]);

        $inventory->update($validated);

        return response()->json([
            'message' => 'Inventory settings updated successfully',
            'data' => $inventory
        ]);
    }

    /**
     * Manual stock entry - Create product with variants and inventory
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function manualEntry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'po_item_id' => 'nullable|exists:purchase_order_items,id',
            'product_data' => 'required|array',
            'product_data.gallery_images' => 'nullable|array',
            'product_data.meta_title' => 'nullable|string|max:255',
            'product_data.meta_description' => 'nullable|string',
            'product_data.meta_keywords' => 'nullable|string',
            'product_data.seo_slug' => 'nullable|string|max:255',
            'variants' => 'required|array|min:1',
            'variants.*.internal_name' => 'required|string|max:255',
            'variants.*.sku' => 'required|string|max:255|unique:product_variants,sku',
            'variants.*.stock_qty' => 'required|integer|min:0',
            'variants.*.landed_cost' => 'required|numeric|min:0',
            // Wholesale
            'variants.*.wholesale_name' => 'nullable|string|max:255',
            'variants.*.wholesale_price' => 'nullable|numeric|min:0',
            'variants.*.wholesale_offer_price' => 'nullable|numeric|min:0',
            'variants.*.wholesale_offer_start' => 'nullable|date',
            'variants.*.wholesale_offer_end' => 'nullable|date|after_or_equal:variants.*.wholesale_offer_start',
            // Retail
            'variants.*.retail_name' => 'nullable|string|max:255',
            'variants.*.retail_price' => 'nullable|numeric|min:0',
            'variants.*.retail_offer_price' => 'nullable|numeric|min:0',
            'variants.*.retail_offer_start' => 'nullable|date',
            'variants.*.retail_offer_end' => 'nullable|date|after_or_equal:variants.*.retail_offer_start',
            // Daraz
            'variants.*.daraz_name' => 'nullable|string|max:255',
            'variants.*.daraz_price' => 'nullable|numeric|min:0',
            'variants.*.daraz_offer_price' => 'nullable|numeric|min:0',
            'variants.*.daraz_offer_start' => 'nullable|date',
            'variants.*.daraz_offer_end' => 'nullable|date|after_or_equal:variants.*.daraz_offer_start',
            // Attribute options
            'variants.*.attribute_options' => 'nullable|array',
            'variants.*.attribute_options.*' => 'exists:attribute_options,id',
        ]);

        // Validate purchase order quantity constraints if this is from a PO
        if (!empty($validated['po_item_id'])) {
            $poItem = PurchaseOrderItem::find($validated['po_item_id']);

            if ($poItem) {
                // Calculate total quantity being stocked
                $totalStockedQty = array_sum(array_column($validated['variants'], 'stock_qty'));

                // Calculate remaining quantity
                $orderedQty = $poItem->quantity;
                $alreadyStockedQty = $poItem->stocked_quantity ?? 0;
                $remainingQty = $orderedQty - $alreadyStockedQty;

                // Validate that total stock doesn't exceed remaining
                if ($totalStockedQty > $remainingQty) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => [
                            'variants' => [
                                "Total quantity ({$totalStockedQty}) exceeds remaining quantity ({$remainingQty}). " .
                                "Ordered: {$orderedQty}, Already stocked: {$alreadyStockedQty}"
                            ]
                        ]
                    ], 422);
                }
            }
        }

        DB::beginTransaction();

        try {
            // Update product with SEO and gallery data
            $product = Product::findOrFail($validated['product_id']);

            $productData = $validated['product_data'];
            $product->update([
                'gallery_images' => $productData['gallery_images'] ?? null,
                'meta_title' => $productData['meta_title'] ?? null,
                'meta_description' => $productData['meta_description'] ?? null,
                'meta_keywords' => $productData['meta_keywords'] ?? null,
                'slug' => $productData['seo_slug'] ?? Str::slug($product->base_name),
            ]);

            $createdVariants = [];

            foreach ($validated['variants'] as $variantData) {
                // Use provided SKU (required field)
                $sku = $variantData['sku'];

                // Calculate offer discount
                $retailDiscount = $this->calculateDiscount(
                    $variantData['retail_price'] ?? 0,
                    $variantData['retail_offer_price'] ?? null
                );

                $wholesaleDiscount = $this->calculateDiscount(
                    $variantData['wholesale_price'] ?? 0,
                    $variantData['wholesale_offer_price'] ?? null
                );

                $darazDiscount = $this->calculateDiscount(
                    $variantData['daraz_price'] ?? 0,
                    $variantData['daraz_offer_price'] ?? null
                );

                // Create variant
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => $sku,
                    'internal_name' => $variantData['internal_name'],
                    'landed_cost' => $variantData['landed_cost'],
                    // Retail
                    'retail_name' => $variantData['retail_name'] ?? $variantData['internal_name'],
                    'retail_price' => $variantData['retail_price'] ?? 0,
                    'retail_offer_discount_type' => $retailDiscount['type'],
                    'retail_offer_discount_value' => $retailDiscount['value'],
                    'retail_offer_start_date' => $variantData['retail_offer_start'] ?? null,
                    'retail_offer_end_date' => $variantData['retail_offer_end'] ?? null,
                    // Wholesale
                    'wholesale_name' => $variantData['wholesale_name'] ?? $variantData['internal_name'],
                    'wholesale_price' => $variantData['wholesale_price'] ?? 0,
                    'wholesale_offer_discount_type' => $wholesaleDiscount['type'],
                    'wholesale_offer_discount_value' => $wholesaleDiscount['value'],
                    'wholesale_offer_start_date' => $variantData['wholesale_offer_start'] ?? null,
                    'wholesale_offer_end_date' => $variantData['wholesale_offer_end'] ?? null,
                    // Daraz
                    'daraz_name' => $variantData['daraz_name'] ?? $variantData['internal_name'],
                    'daraz_price' => $variantData['daraz_price'] ?? 0,
                    'daraz_offer_discount_type' => $darazDiscount['type'],
                    'daraz_offer_discount_value' => $darazDiscount['value'],
                    'daraz_offer_start_date' => $variantData['daraz_offer_start'] ?? null,
                    'daraz_offer_end_date' => $variantData['daraz_offer_end'] ?? null,
                ]);

                // Attach attribute options if provided
                if (!empty($variantData['attribute_options'])) {
                    $variant->attributeOptions()->sync($variantData['attribute_options']);
                }

                // Create inventory record
                $inventory = Inventory::create([
                    'product_variant_id' => $variant->id,
                    'quantity' => $variantData['stock_qty'],
                    'last_unit_cost' => $variantData['landed_cost'],
                    'average_unit_cost' => $variantData['landed_cost'],
                    'total_value' => $variantData['stock_qty'] * $variantData['landed_cost'],
                    'last_stocked_at' => now(),
                ]);

                $createdVariants[] = [
                    'variant' => $variant,
                    'inventory' => $inventory,
                ];
            }

            // Update purchase order item stocked quantity if this is from a PO
            if (!empty($validated['po_item_id'])) {
                $poItem = PurchaseOrderItem::find($validated['po_item_id']);

                if ($poItem) {
                    // Calculate total quantity being stocked from all variants
                    $totalStockedQty = array_sum(array_column($validated['variants'], 'stock_qty'));

                    // Update the stocked quantity (increment by the total being added)
                    $poItem->increment('stocked_quantity', $totalStockedQty);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Stock entry created successfully',
                'data' => [
                    'product' => $product,
                    'variants' => $createdVariants,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create stock entry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate discount type and value from base price and offer price
     */
    private function calculateDiscount(float $basePrice, ?float $offerPrice): array
    {
        if (!$offerPrice || $offerPrice >= $basePrice) {
            return ['type' => null, 'value' => null];
        }

        $difference = $basePrice - $offerPrice;

        // Calculate as flat discount
        return [
            'type' => 'flat',
            'value' => $difference
        ];
    }

    /**
     * Add stock to existing inventory
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function addToStock(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'nullable|numeric|min:0',
            'items.*.location' => 'nullable|string|max:100',
        ]);

        DB::beginTransaction();

        try {
            $results = [];

            foreach ($validated['items'] as $item) {
                $variantId = $item['product_variant_id'];
                $quantity = $item['quantity'];
                $unitCost = $item['unit_cost'] ?? null;
                $location = $item['location'] ?? null;

                // Find or create inventory record
                $inventory = Inventory::firstOrCreate(
                    ['product_variant_id' => $variantId],
                    [
                        'quantity' => 0,
                        'reserved_quantity' => 0,
                        'average_unit_cost' => $unitCost,
                        'last_unit_cost' => $unitCost,
                        'total_value' => 0,
                        'location' => $location,
                    ]
                );

                // Add stock using the model method
                $inventory->addStock($quantity, $unitCost);

                // Update location if provided
                if ($location) {
                    $inventory->location = $location;
                    $inventory->save();
                }

                // Load relationships for response
                $inventory->load([
                    'productVariant.product',
                    'productVariant.attributeOptions.attribute'
                ]);

                $results[] = [
                    'product_variant_id' => $variantId,
                    'variant_name' => $inventory->productVariant->internal_name ??
                                     $inventory->productVariant->retail_name,
                    'product_name' => $inventory->productVariant->product->base_name,
                    'added_quantity' => $quantity,
                    'new_total_quantity' => $inventory->quantity,
                    'average_unit_cost' => $inventory->average_unit_cost,
                    'total_value' => $inventory->total_value,
                    'inventory' => $inventory,
                ];
            }

            DB::commit();

            return response()->json([
                'message' => 'Stock added successfully',
                'data' => $results
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get stock summary with all product variants and inventory
     *
     * @return JsonResponse
     */
    public function stockSummary(): JsonResponse
    {
        $query = ProductVariant::with(['inventory', 'product'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc');

        $variants = $query->get();

        $transformedVariants = [];
        foreach ($variants as $variant) {
            // Only include variants that have a product
            if (!$variant->product) {
                continue;
            }

            // Get the first inventory record (since it's hasMany relationship)
            $inventory = $variant->inventory->first();
            $availableQuantity = $inventory ? ($inventory->quantity - $inventory->reserved_quantity) : 0;
            $minStockLevel = $inventory ? $inventory->min_stock_level : 0;

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
                'status' => $variant->status ?? 'active',
                'product' => [
                    'id' => $variant->product->id,
                    'base_name' => $variant->product->base_name ?? 'Unknown Product',
                    'base_thumbnail_url' => $variant->product->base_thumbnail_url,
                    'video_url' => $variant->product->video_url,
                    'gallery_images' => $variant->product->gallery_images,
                ],
                'inventory' => $inventory ? [
                    'id' => $inventory->id,
                    'quantity' => (int) $inventory->quantity,
                    'reserved_quantity' => (int) $inventory->reserved_quantity,
                    'min_stock_level' => (int) $inventory->min_stock_level,
                ] : null,
                'available_quantity' => $availableQuantity,
                'stock_status' => $availableQuantity === 0 ? 'out_of_stock' :
                                ($availableQuantity <= $minStockLevel ? 'low_stock' : 'in_stock'),
            ];
        }

        return response()->json($transformedVariants);
    }
}
