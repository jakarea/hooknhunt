<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

class ProductController extends Controller
{
    /**
     * Get all published products with variants and inventory
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['variants.inventory'])
            ->where('status', 'published')
            ->whereHas('variants', function ($q) {
                $q->where('status', 'active')
                  ->whereHas('inventory', function ($invQuery) {
                      $invQuery->whereRaw('quantity - reserved_quantity > 0');
                  });
            })
            ->orderBy('base_name');

        // Filter by category
        if ($request->has('category_id')) {
            $query->whereJsonContains('category_ids', $request->category_id);
        }

        // Filter by category slug
        if ($request->has('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->whereJsonContains('category_ids', $category->id);
            }
        }

        // Search by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('base_name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('retail_price', '>=', $request->min_price);
            });
        }

        if ($request->has('max_price')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('retail_price', '<=', $request->max_price);
            });
        }

        // Sort by
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');

        switch ($sortBy) {
            case 'price_low':
                $query->whereHas('variants', function ($q) {
                    $q->orderBy('retail_price', 'asc');
                });
                break;
            case 'price_high':
                $query->whereHas('variants', function ($q) {
                    $q->orderBy('retail_price', 'desc');
                });
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'name':
            default:
                $query->orderBy('base_name', $sortOrder);
                break;
        }

        // Pagination
        $perPage = min($request->get('per_page', 20), 100); // Max 100 per page
        $products = $query->paginate($perPage);

        // Transform products data
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });

        return response()->json([
            'products' => $transformedProducts,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    /**
     * Get a single product by slug
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['variants'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'product' => $this->transformProduct($product, true)
        ]);
    }

    /**
     * Get featured products
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 12), 50); // Max 50 featured products

        $products = Product::with(['variants.inventory'])
            ->where('status', 'published')
            ->whereHas('variants', function ($q) {
                $q->where('status', 'active')
                  ->whereHas('inventory', function ($invQuery) {
                      $invQuery->whereRaw('quantity - reserved_quantity > 0');
                  });
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                return $this->transformProduct($product);
            });

        return response()->json($products);
    }

    /**
     * Get products by category
     *
     * @param string $categorySlug
     * @param Request $request
     * @return JsonResponse
     */
    public function byCategory(string $categorySlug, Request $request): JsonResponse
    {
        $category = Category::where('slug', $categorySlug)->first();

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        // Get category and its children
        $categoryIds = [$category->id];
        $children = Category::where('parent_id', $category->id)->get();
        foreach ($children as $child) {
            $categoryIds[] = $child->id;
        }

        $query = Product::with(['variants'])
            ->where('status', 'published')
            ->whereHas('variants', function ($q) {
                $q->where('status', 'active')
                  ->whereHas('inventory', function ($invQuery) {
                      $invQuery->whereRaw('quantity - reserved_quantity > 0');
                  });
            })
            ->where(function ($q) use ($categoryIds) {
                foreach ($categoryIds as $categoryId) {
                    $q->orWhereJsonContains('category_ids', $categoryId);
                }
            })
            ->orderBy('base_name');

        // Apply same filters as index method
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('base_name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Pagination
        $perPage = min($request->get('per_page', 20), 100);
        $products = $query->paginate($perPage);

        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image_url' => $category->image_url,
            ],
            'products' => $transformedProducts,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    /**
     * Get related products
     *
     * @param string $slug
     * @param Request $request
     * @return JsonResponse
     */
    public function related(string $slug, Request $request): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        // Get products from same categories
        $relatedProducts = Product::with(['variants'])
            ->where('status', 'published')
            ->where('id', '!=', $product->id)
            ->whereHas('variants', function ($q) {
                $q->where('status', 'active')
                  ->whereHas('inventory', function ($invQuery) {
                      $invQuery->whereRaw('quantity - reserved_quantity > 0');
                  });
            })
            ->where(function ($q) use ($product) {
                foreach ($product->category_ids ?? [] as $categoryId) {
                    $q->orWhereJsonContains('category_ids', $categoryId);
                }
            })
            ->inRandomOrder()
            ->limit($request->get('limit', 8))
            ->get()
            ->map(function ($product) {
                return $this->transformProduct($product);
            });

        return response()->json($relatedProducts);
    }

    /**
     * Transform product data for storefront
     *
     * @param Product $product
     * @param bool $includeDetails
     * @return array
     */
    private function transformProduct(Product $product, bool $includeDetails = false): array
    {
        $variants = $product->variants->filter(function ($variant) {
            return $variant->status === 'active';
        });

        $minPrice = $variants->min('retail_price');
        $maxPrice = $variants->max('retail_price');

        // Check for active offers
        $hasActiveOffer = $variants->contains(function ($variant) {
            return $this->hasActiveOffer($variant, 'retail');
        });

        // Calculate total available stock across all variants
        $totalStock = $variants->sum(function ($variant) {
            $inventory = $variant->inventory->first();
            return $inventory ? ($inventory->quantity - $inventory->reserved_quantity) : 0;
        });

        // Check if product is in stock
        $inStock = $totalStock > 0;

        $transformed = [
            'id' => $product->id,
            'name' => $product->base_name,
            'slug' => $product->slug,
            'thumbnail_url' => $product->base_thumbnail_url,
            'gallery_images' => $product->gallery_images ?? [],
            'price_range' => [
                'min' => $minPrice,
                'max' => $maxPrice,
                'display' => $this->formatPriceRange($minPrice, $maxPrice)
            ],
            'has_offer' => $hasActiveOffer,
            'variant_count' => $variants->count(),
            'categories' => $product->categories->map(function ($category) {
                return [
                    'name' => $category->name,
                    'slug' => $category->slug,
                ];
            })->toArray(),
            'stock_info' => [
                'in_stock' => $inStock,
                'total_available' => $totalStock,
                'low_stock' => $totalStock > 0 && $totalStock <= 10, // Consider low stock if <= 10 units
                'stock_status' => $this->getStockStatus($totalStock)
            ]
        ];

        if ($includeDetails) {
            $transformed['description'] = $product->description;
            $transformed['meta_title'] = $product->meta_title;
            $transformed['meta_description'] = $product->meta_description;
            $transformed['variants'] = $variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'name' => $variant->retail_name,
                    'retail_price' => (float) $variant->retail_price,
                    'wholesale_price' => (float) $variant->wholesale_price,
                    'moq_wholesale' => $variant->moq_wholesale,
                    'weight' => $variant->weight,
                    'dimensions' => $variant->dimensions,
                    'retail_offer' => $this->getOfferData($variant, 'retail'),
                    'wholesale_offer' => $this->getOfferData($variant, 'wholesale'),
                    'stock_info' => $this->getVariantStockInfo($variant),
                    'image' => $this->getVariantImage($variant)
                ];
            })->toArray();
        }

        return $transformed;
    }

    /**
     * Transform variant data for storefront
     *
     * @param ProductVariant $variant
     * @return array
     */
    private function transformVariant(ProductVariant $variant): array
    {
        $retailOffer = $this->getOfferData($variant, 'retail');
        $wholesaleOffer = $this->getOfferData($variant, 'wholesale');

        return [
            'id' => $variant->id,
            'sku' => $variant->sku,
            'name' => $variant->retail_name,
            'retail_price' => (float) $variant->retail_price,
            'wholesale_price' => (float) $variant->wholesale_price,
            'moq_wholesale' => $variant->moq_wholesale,
            'weight' => $variant->weight,
            'dimensions' => $variant->dimensions,
            'retail_offer' => $retailOffer,
            'wholesale_offer' => $wholesaleOffer,
        ];
    }

    /**
     * Get offer data for a variant and channel
     *
     * @param ProductVariant $variant
     * @param string $channel
     * @return array|null
     */
    private function getOfferData(ProductVariant $variant, string $channel): ?array
    {
        $discountTypeField = "{$channel}_offer_discount_type";
        $discountValueField = "{$channel}_offer_discount_value";
        $startDateField = "{$channel}_offer_start_date";
        $endDateField = "{$channel}_offer_end_date";

        if (!$variant->$discountTypeField || !$variant->$discountValueField) {
            return null;
        }

        $now = now();
        $startDate = $variant->$startDateField;
        $endDate = $variant->$endDateField;

        if ($startDate && $now->lt($startDate)) {
            return null; // Offer hasn't started
        }

        if ($endDate && $now->gt($endDate)) {
            return null; // Offer has ended
        }

        $basePrice = $variant->{"{$channel}_price"};
        $discountType = $variant->$discountTypeField;
        $discountValue = $variant->$discountValueField;

        $finalPrice = $discountType === 'percentage'
            ? $basePrice * (1 - $discountValue / 100)
            : max(0, $basePrice - $discountValue);

        return [
            'type' => $discountType,
            'value' => (float) $discountValue,
            'original_price' => (float) $basePrice,
            'final_price' => round($finalPrice, 2),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    /**
     * Check if variant has active offer
     *
     * @param ProductVariant $variant
     * @param string $channel
     * @return bool
     */
    private function hasActiveOffer(ProductVariant $variant, string $channel): bool
    {
        return $this->getOfferData($variant, $channel) !== null;
    }

    /**
     * Get variant stock information
     *
     * @param ProductVariant $variant
     * @return array
     */
    private function getVariantStockInfo(ProductVariant $variant): array
    {
        $inventory = $variant->inventory->first();
        $availableStock = $inventory ? ($inventory->quantity - $inventory->reserved_quantity) : 0;

        return [
            'available' => $availableStock,
            'in_stock' => $availableStock > 0,
            'low_stock' => $availableStock > 0 && $availableStock <= 5,
            'stock_status' => $this->getStockStatus($availableStock)
        ];
    }

    /**
     * Get stock status based on available quantity
     *
     * @param int $availableStock
     * @return string
     */
    private function getStockStatus(int $availableStock): string
    {
        if ($availableStock <= 0) {
            return 'out_of_stock';
        } elseif ($availableStock <= 5) {
            return 'low_stock';
        } elseif ($availableStock <= 20) {
            return 'limited_stock';
        } else {
            return 'in_stock';
        }
    }

    /**
     * Format price range for display
     *
     * @param float|null $minPrice
     * @param float|null $maxPrice
     * @return string
     */
    private function formatPriceRange(?float $minPrice, ?float $maxPrice): string
    {
        if (!$minPrice && !$maxPrice) {
            return 'Price not available';
        }

        if ($minPrice === $maxPrice) {
            return '৳' . number_format($minPrice, 2);
        }

        return '৳' . number_format($minPrice, 2) . ' - ৳' . number_format($maxPrice, 2);
    }

    /**
     * Get variant image URL
     *
     * @param ProductVariant $variant
     * @return array
     */
    private function getVariantImage(ProductVariant $variant): array
    {
        // Priority order: variant_thumbnail_url -> retail_thumbnail_url -> product thumbnail
        $imageUrl = $variant->variant_thumbnail_url
                   ?? $variant->retail_thumbnail_url
                   ?? $variant->product->base_thumbnail_url;

        return [
            'url' => $imageUrl,
            'thumbnail_url' => $imageUrl, // For now, same URL - can be enhanced with actual thumbnails
            'alt_text' => $variant->retail_name . ' - ' . $variant->product->base_name
        ];
    }
}