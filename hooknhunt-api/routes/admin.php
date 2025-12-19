<?php

use App\Http\Controllers\Api\V1\Admin\AttributeController;
use App\Http\Controllers\Api\V1\Admin\AttributeOptionController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\InventoryController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\ProductSupplierController;
use App\Http\Controllers\Api\V1\Admin\PurchaseOrderController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\SmsController;
use App\Http\Controllers\Api\V1\Admin\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ADMIN API Routes
|--------------------------------------------------------------------------
|
| This file contains all routes for the Admin Panel (React Admin UI)
| These routes are protected by authentication and role-based permissions
|
*/

Route::prefix('v1/admin')->group(function () {

    // Public Admin Auth (Login only)
    Route::post('/auth/login', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'login']);

    // Authenticated Admin Routes
    Route::middleware('auth:sanctum')->group(function () {

        // Admin Auth Management
        Route::post('/auth/logout', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'logout']);
        Route::get('/me', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'me']);

        // ===============================================
        // SUPER ADMIN & ADMIN ROUTES
        // ===============================================
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::apiResource('users', App\Http\Controllers\Api\V1\Admin\UserController::class);

            // User Verification Routes
            Route::post('/users/{user}/verify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'verifyPhone']);
            Route::post('/users/{user}/unverify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'unverifyPhone']);

            Route::apiResource('attributes', AttributeController::class);
            Route::apiResource('attribute-options', AttributeOptionController::class);
        });

        // ===============================================
        // MARKETER, ADMIN, SUPER ADMIN ROUTES
        // ===============================================
        Route::middleware('role:super_admin,admin,marketer')->group(function () {
            Route::apiResource('categories', CategoryController::class);
        });

        // ===============================================
        // PRODUCT & SUPPLIER MANAGEMENT ROUTES
        // (Super Admin, Admin, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
            Route::apiResource('products', ProductController::class);

            // Product-Supplier relationship routes
            Route::post('/products/{product}/suppliers', [ProductSupplierController::class, 'store']);
            Route::delete('/products/{product}/suppliers/{supplier}', [ProductSupplierController::class, 'destroy']);

            // Product variants routes
            Route::get('/product-variants', [ProductController::class, 'variants']);
            Route::put('/product-variants/{id}', [ProductController::class, 'updateVariant']);
        });

        // ===============================================
        // SUPPLIER MANAGEMENT ROUTES
        // (Super Admin, Admin, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
            Route::apiResource('suppliers', SupplierController::class);

            // Supplier QR Code Management
            Route::delete('/suppliers/{supplier}/wechat-qr', [SupplierController::class, 'removeWechatQr']);
            Route::delete('/suppliers/{supplier}/alipay-qr', [SupplierController::class, 'removeAlipayQr']);

            // Supplier Products
            Route::get('/suppliers/{supplier}/products-count', [SupplierController::class, 'productsCount']);
            Route::get('/suppliers/{supplier}/products', [SupplierController::class, 'products']);
        });

        // ===============================================
        // PURCHASE ORDER MANAGEMENT ROUTES
        // (Super Admin, Admin, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
            Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
            Route::get('/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'show']);
            Route::post('/purchase-orders', [PurchaseOrderController::class, 'store']);
            Route::put('/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'update']);
            Route::put('/purchase-orders/{purchase_order}/status', [PurchaseOrderController::class, 'updateStatus']);
            Route::put('/purchase-orders/{purchase_order}/recalculate-costs', [PurchaseOrderController::class, 'recalculateCosts']);
            Route::post('/purchase-orders/{purchase_order}/receive-items', [PurchaseOrderController::class, 'receiveItems']);
            Route::get('/purchase-order-items/{id}', [PurchaseOrderController::class, 'getItem']);
            Route::get('/purchase-order-items', [PurchaseOrderController::class, 'getItemsReadyToStock']);
            Route::post('/inventory/receive-stock', [PurchaseOrderController::class, 'receiveStock']);
        });

        // ===============================================
        // INVENTORY MANAGEMENT ROUTES
        // (Super Admin, Admin, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,store_keeper')->prefix('inventory')->group(function () {
            Route::get('/stock-summary', [InventoryController::class, 'stockSummary']);
            Route::get('/stats', [InventoryController::class, 'stats']);
            Route::get('/', [InventoryController::class, 'index']);
            Route::get('/{id}', [InventoryController::class, 'show']);
            Route::post('/bulk-update', [InventoryController::class, 'bulkUpdate']);
            Route::post('/add-stock', [InventoryController::class, 'addToStock']);
            Route::post('/manual-entry', [InventoryController::class, 'manualEntry']);
            Route::put('/{id}', [InventoryController::class, 'update']);
        });

        // ===============================================
        // SYSTEM SETTINGS ROUTES
        // (Super Admin Only)
        // ===============================================
        Route::middleware('role:super_admin')->group(function () {
            Route::get('/settings', [SettingController::class, 'index']);
            Route::post('/settings', [SettingController::class, 'update']);
        });

        // ===============================================
        // SMS MANAGEMENT ROUTES
        // (Super Admin, Admin, Store Keeper, Marketer)
        // ===============================================
        Route::middleware('role:super_admin,admin,store_keeper,marketer')->prefix('sms')->group(function () {
            Route::get('/', [SmsController::class, 'index']); // Get SMS logs
            Route::post('/send', [SmsController::class, 'send']); // Send SMS
            Route::get('/balance', [SmsController::class, 'getBalance']); // Get account balance
            Route::get('/statistics', [SmsController::class, 'statistics']); // Get statistics
            Route::get('/{id}/report', [SmsController::class, 'getReport']); // Get delivery report for specific SMS
            Route::post('/refresh-reports', [SmsController::class, 'refreshReports']); // Refresh all pending reports
        });

        // ===============================================
        // FUTURE ROUTES (To be implemented later)
        // ===============================================
        // We will add sales order management here
        // We will add customer management here
        // We will add reporting and analytics here
        // We will add financial reports here
        // ... (other modules will be added later) ...

    });

});