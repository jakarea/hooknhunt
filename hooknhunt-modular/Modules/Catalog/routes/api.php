<?php

use Illuminate\Support\Facades\Route;
use Modules\Catalog\Http\Controllers\ProductController;
use Modules\Catalog\Http\Controllers\CategoryController;
use Modules\Catalog\Http\Controllers\BrandController;
use Modules\Catalog\Http\Controllers\AttributeController;
use Modules\Catalog\Http\Controllers\DiscountController;
use Modules\Catalog\Http\Controllers\ProductPricingController;

/*
|--------------------------------------------------------------------------
| Catalog Module - API Routes
|--------------------------------------------------------------------------
|
| Product catalog management endpoints
| Prefix: /api/v2/catalog
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // ====================================================
    // Product Catalog Routes
    // ====================================================
    Route::prefix('catalog')->group(function () {
        // Specific routes must come BEFORE apiResource to avoid route matching conflicts
        Route::get('categories/dropdown', [CategoryController::class, 'dropdown']);
        Route::get('helpers/categories/tree', [CategoryController::class, 'treeStructure']);
        Route::get('brands/dropdown', [BrandController::class, 'dropdown']);
        Route::post('products/{id}/duplicate', [ProductController::class, 'duplicate']);
        Route::patch('products/{id}/status', [ProductController::class, 'updateStatus']);
        Route::post('products/{id}/variants', [ProductController::class, 'storeVariant']);
        Route::post('products/{id}/suppliers', [ProductController::class, 'addSupplier']);
        Route::post('pricing/update', [ProductPricingController::class, 'updatePrices']);

        // Resources
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('brands', BrandController::class);
        Route::apiResource('attributes', AttributeController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('discounts', DiscountController::class);
    });

});

// Health Check (Always Public)
Route::get('catalog/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'catalog-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
