<?php

use App\Http\Controllers\Api\V1\Admin\AttributeController;
use App\Http\Controllers\Api\V1\Admin\AttributeOptionController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\ProductSupplierController;
use App\Http\Controllers\Api\V1\Admin\PurchaseOrderController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\SmsController;
use App\Http\Controllers\Api\V1\Admin\SupplierController;
use App\Http\Controllers\Api\V1\Storefront\AccountController;
use App\Http\Controllers\Api\V1\Storefront\AuthController;
use Illuminate\Support\Facades\Route;

// Storefront API (For Next.js Website)
Route::prefix('v1/store')->group(function () {

    // Public Auth (Registration, Login, OTP)
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

    // Authenticated Account Routes (My Profile, My Orders, etc.)
    Route::middleware('auth:sanctum')->prefix('account')->group(function () {
        Route::get('/me', [AccountController::class, 'me']);
        Route::post('/logout', [AccountController::class, 'logout']);

        Route::put('/profile', [AccountController::class, 'updateProfile']);

        Route::get('/addresses', [AccountController::class, 'getAddresses']);
        Route::post('/addresses', [AccountController::class, 'addAddress']);
        Route::delete('/addresses/{address}', [AccountController::class, 'deleteAddress']);

        // We will add '/orders' here in a future step
    });

    // We will add public '/products' routes here in a future step
});

// --- ADMIN API (For React Admin Panel) ---
Route::prefix('v1/admin')->group(function () {

    // Public Auth (Admin Login)
    Route::post('/auth/login', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'login']);

    // Authenticated Admin Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::post('/auth/logout', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'logout']);
        Route::get('/me', [App\Http\Controllers\Api\V1\Admin\AuthController::class, 'me']);

        // --- Super Admin & Admin Routes ---
        Route::middleware('role:super_admin,admin')->group(function () {
            Route::apiResource('users', App\Http\Controllers\Api\V1\Admin\UserController::class);

            // User Verification Routes
            Route::post('/users/{user}/verify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'verifyPhone']);
            Route::post('/users/{user}/unverify-phone', [App\Http\Controllers\Api\V1\Admin\UserController::class, 'unverifyPhone']);

            Route::apiResource('attributes', AttributeController::class);
            Route::apiResource('attribute-options', AttributeOptionController::class);
        });

        // --- Marketer, Admin, Super Admin Routes ---
        Route::middleware('role:super_admin,admin,marketer')->group(function () {
            Route::apiResource('categories', CategoryController::class);
        });

        // --- Super Admin & Admin & Store Keeper Routes (Products & Suppliers) ---
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
            Route::apiResource('products', ProductController::class);

            // Product-Supplier relationship routes
            Route::post('/products/{product}/suppliers', [ProductSupplierController::class, 'store']);
            Route::delete('/products/{product}/suppliers/{supplier}', [ProductSupplierController::class, 'destroy']);
        });

        // --- Store Keeper, Admin, Super Admin, Senior Staff Routes (Suppliers) ---
        Route::middleware('role:super_admin,admin,store_keeper,senior_staff')->group(function () {
            Route::apiResource('suppliers', SupplierController::class);
            Route::delete('/suppliers/{supplier}/wechat-qr', [SupplierController::class, 'removeWechatQr']);
            Route::delete('/suppliers/{supplier}/alipay-qr', [SupplierController::class, 'removeAlipayQr']);
            Route::get('/suppliers/{supplier}/products-count', [SupplierController::class, 'productsCount']);
            Route::get('/suppliers/{supplier}/products', [SupplierController::class, 'products']);
        });

        // --- Store Keeper, Admin, Super Admin, Senior Staff Routes (Purchase Orders) ---
        Route::middleware('role:super_admin,admin,store_keeper,senior_staff')->group(function () {
            Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
            Route::get('/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'show']);
            Route::post('/purchase-orders', [PurchaseOrderController::class, 'store']);
            Route::put('/purchase-orders/{purchase_order}', [PurchaseOrderController::class, 'update']);
            Route::put('/purchase-orders/{purchase_order}/status', [PurchaseOrderController::class, 'updateStatus']);
            Route::post('/purchase-orders/{purchase_order}/receive-items', [PurchaseOrderController::class, 'receiveItems']);
        });

        // --- Super Admin Only Routes (Settings) ---
        Route::middleware('role:super_admin')->group(function () {
            Route::get('/settings', [SettingController::class, 'index']);
            Route::post('/settings', [SettingController::class, 'update']);
        });

        // --- SMS Routes (Admin, Super Admin, Senior Staff, Marketer) ---
        Route::middleware('role:super_admin,admin,store_keeper,marketer')->prefix('sms')->group(function () {
            Route::get('/', [SmsController::class, 'index']); // Get SMS logs
            Route::post('/send', [SmsController::class, 'send']); // Send SMS
            Route::get('/balance', [SmsController::class, 'getBalance']); // Get account balance
            Route::get('/statistics', [SmsController::class, 'statistics']); // Get statistics
            Route::get('/{id}/report', [SmsController::class, 'getReport']); // Get delivery report for specific SMS
            Route::post('/refresh-reports', [SmsController::class, 'refreshReports']); // Refresh all pending reports
        });

        // ... (other roles will be added later) ...
    });
});