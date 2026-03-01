<?php

use Illuminate\Support\Facades\Route;
use Modules\Procurement\Http\Controllers\ProcurementController;
use Modules\Procurement\Http\Controllers\PurchaseOrderController;

/*
|--------------------------------------------------------------------------
| Procurement Module - API Routes
|--------------------------------------------------------------------------
|
| Procurement and purchase order management endpoints
| Prefix: /api/v2/procurement
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // ====================================================
    // Procurement Products Management
    // ====================================================
    Route::prefix('procurement')->group(function () {
        // Statistics - must come before apiResource
        Route::get('statistics', [ProcurementController::class, 'statistics']);
        Route::get('suppliers/{id}/products', [ProcurementController::class, 'getBySupplier']);
        Route::patch('products/{id}/status', [ProcurementController::class, 'updateStatus']);
        Route::apiResource('products', ProcurementController::class);

        // Purchase Orders
        Route::prefix('orders')->group(function () {
            Route::get('statistics', [PurchaseOrderController::class, 'statistics']);
            Route::patch('{id}/status', [PurchaseOrderController::class, 'updateStatus']);
            Route::post('{id}/approve-and-stock', [PurchaseOrderController::class, 'approveAndStock']);
            Route::patch('{poId}/status-history/{historyId}/comments', [PurchaseOrderController::class, 'updateStatusHistoryComments']);
            Route::apiResource('', PurchaseOrderController::class, [
                'only' => ['index', 'store', 'show', 'update', 'destroy']
            ]);
        });
    });

});

// Health Check (Always Public)
Route::get('procurement/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'procurement-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
