<?php

use App\Http\Controllers\Api\V1\Admin\AttributeController;
use App\Http\Controllers\Api\V1\Admin\AttributeOptionController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
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
            Route::apiResource('attributes', AttributeController::class);
            Route::apiResource('attribute-options', AttributeOptionController::class);
        });

        // --- Marketer, Admin, Super Admin Routes ---
        Route::middleware('role:super_admin,admin,marketer')->group(function () {
            Route::apiResource('categories', CategoryController::class);
        });

        // --- Store Keeper, Admin, Super Admin Routes ---
        Route::middleware('role:super_admin,admin,store_keeper')->group(function () {
            Route::apiResource('suppliers', SupplierController::class);
        });
        
        // ... (other roles will be added later) ...
    });
});