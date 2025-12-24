<?php

use App\Http\Controllers\Api\V1\Admin\AttributeController;
use App\Http\Controllers\Api\V1\Admin\AttributeOptionController;
use App\Http\Controllers\Api\V1\Admin\BrandController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\InventoryController;
use App\Http\Controllers\Api\V1\Admin\MediaController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\ProductSupplierController;
use App\Http\Controllers\Api\V1\Admin\PurchaseOrderController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\SmsController;
use App\Http\Controllers\Api\V1\Admin\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ADMIN API ROUTES
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

        // Dashboard Statistics
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // ===============================================
        // SUPER ADMIN & ADMIN ROUTES
        // ===============================================
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::apiResource('users', App\Http\Controllers\Api\V1\Admin\UserController::class);

            // User Verification Routes
            Route::post('/users/{user}/verify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'verifyPhone']);
            Route::post('/users/{user}/unverify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'unverifyPhone']);
        });

        // ===============================================
        // ATTRIBUTES ROUTES
        // (Super Admin, Admin, Manager, Store Keeper, Marketer)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,store_keeper,marketer')->group(function () {
            Route::apiResource('attributes', AttributeController::class);
            Route::apiResource('attribute-options', AttributeOptionController::class);
        });

        // ===============================================
        // MARKETER, ADMIN, SUPER ADMIN, STORE KEEPER ROUTES
        // (Now includes Manager and Supervisor as per RBAC.md)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper,marketer,seller')->group(function () {
            Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
            Route::apiResource('brands', BrandController::class)->only(['index', 'show']);
        });

        // Full CRUD for Categories, Brands (non-seller roles)
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper,marketer')->group(function () {
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            Route::apiResource('brands', BrandController::class)->except(['index', 'show']);
        });

        // ===============================================
        // PRODUCT & SUPPLIER MANAGEMENT ROUTES
        // (Super Admin, Admin, Manager, Supervisor, Store Keeper, Marketer, Seller)
        // Seller has read-only access
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper,marketer,seller')->group(function () {
            Route::get('/products', [ProductController::class, 'index']);
            Route::get('/products/{product}', [ProductController::class, 'show']);
        });

        // Full Product CRUD (excluding seller)
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper,marketer')->group(function () {
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);

            // Product-Supplier relationship routes
            Route::post('/products/{product}/suppliers', [ProductSupplierController::class, 'store']);
            Route::delete('/products/{product}/suppliers/{supplier}', [ProductSupplierController::class, 'destroy']);

            // Product variants routes
            Route::get('/product-variants', [ProductController::class, 'variants']);
            Route::put('/product-variants/{id}', [ProductController::class, 'updateVariant']);

            // Product media update route
            Route::post('/products/{product}/update-media', [ProductController::class, 'updateMedia']);

            // Single image upload route
            Route::post('/products/upload-gallery-image', [ProductController::class, 'uploadGalleryImage']);
        });

        // ===============================================
        // SUPPLIER MANAGEMENT ROUTES
        // (Super Admin, Admin, Manager, Supervisor, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper')->group(function () {
            Route::get('/suppliers', [SupplierController::class, 'index']);
            Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']);

            // Supplier Products (read-only for supervisor)
            Route::get('/suppliers/{supplier}/products-count', [SupplierController::class, 'productsCount']);
            Route::get('/suppliers/{supplier}/products', [SupplierController::class, 'products']);
        });

        // Full Supplier CRUD (excluding supervisor)
        Route::middleware('role:super_admin,admin,manager,store_keeper')->group(function () {
            Route::post('/suppliers', [SupplierController::class, 'store']);
            Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
            Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);

            // Supplier QR Code Management
            Route::delete('/suppliers/{supplier}/wechat-qr', [SupplierController::class, 'removeWechatQr']);
            Route::delete('/suppliers/{supplier}/alipay-qr', [SupplierController::class, 'removeAlipayQr']);
        });

        // ===============================================
        // PURCHASE ORDER MANAGEMENT ROUTES
        // (Super Admin, Admin, Manager, Supervisor, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper')->group(function () {
            Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
            Route::get('/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'show']);
        });

        // Create and Update PO (excluding supervisor)
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
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
        // (Super Admin, Admin, Manager, Supervisor, Store Keeper)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,supervisor,store_keeper')->prefix('inventory')->group(function () {
            Route::get('/stock-summary', [InventoryController::class, 'stockSummary']);
            Route::get('/stats', [InventoryController::class, 'stats']);
            Route::get('/', [InventoryController::class, 'index']);
            Route::get('/{id}', [InventoryController::class, 'show']);
        });

        // Inventory modifications (excluding supervisor)
        Route::middleware('role:super_admin,admin,manager,store_keeper')->prefix('inventory')->group(function () {
            Route::post('/bulk-update', [InventoryController::class, 'bulkUpdate']);
            Route::post('/add-stock', [InventoryController::class, 'addToStock']);
            Route::post('/manual-entry', [InventoryController::class, 'manualEntry']);
            Route::put('/{id}', [InventoryController::class, 'update']);
        });

        // ===============================================
        // MEDIA MANAGEMENT ROUTES
        // (Super Admin, Admin, Manager, Store Keeper, Marketer)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,store_keeper,marketer')->prefix('media')->group(function () {
            Route::get('/', [MediaController::class, 'index']); // List media files
            Route::post('/', [MediaController::class, 'store']); // Upload media file
            Route::get('/folders', [MediaController::class, 'folders']); // Get folders
            Route::post('/folders', [MediaController::class, 'storeFolder']); // Create folder
            Route::get('/{mediaFile}', [MediaController::class, 'show']); // Get media file details
            Route::put('/{mediaFile}', [MediaController::class, 'update']); // Update media file
            Route::delete('/{mediaFile}', [MediaController::class, 'destroy']); // Delete media file
        });

        // ===============================================
        // SYSTEM SETTINGS ROUTES
        // ===============================================
        // Read settings - accessible to all authenticated admin users
        Route::get('/settings', [SettingController::class, 'index']);

        // Update settings - Super Admin only
        Route::middleware('role:super_admin')->group(function () {
            Route::post('/settings', [SettingController::class, 'update']);
        });

        // ===============================================
        // SMS MANAGEMENT ROUTES
        // (Super Admin, Admin, Manager, Store Keeper, Marketer)
        // ===============================================
        Route::middleware('role:super_admin,admin,manager,store_keeper,marketer')->prefix('sms')->group(function () {
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
