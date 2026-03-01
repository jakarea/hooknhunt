<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GatewayController;

/*
|--------------------------------------------------------------------------
| API Gateway Routes
|--------------------------------------------------------------------------
|
| Single entry point for all frontend requests
|
*/

// Health check (always public)
Route::get('/health', [GatewayController::class, 'health']);

// Auth service routes (public + protected)
Route::prefix('auth')->group(function () {
    // Public routes (no authentication)
    Route::post('/login', [GatewayController::class, 'forward']);
    Route::post('/register', [GatewayController::class, 'forward']);
    Route::post('/verify-otp', [GatewayController::class, 'forward']);
    Route::post('/resend-otp', [GatewayController::class, 'forward']);

    // Protected routes (require authentication)
    Route::middleware('auth.gateway')->group(function () {
        Route::get('/me', [GatewayController::class, 'forward']);
        Route::put('/profile', [GatewayController::class, 'forward']);
        Route::put('/change-password', [GatewayController::class, 'forward']);
        Route::post('/logout', [GatewayController::class, 'forward']);
    });
});

// Catalog service routes
Route::prefix('catalog')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Inventory service routes
Route::prefix('inventory')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Sales service routes
Route::prefix('sales')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Finance service routes
Route::prefix('finance')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Procurement service routes
Route::prefix('procurement')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Logistics service routes
Route::prefix('logistics')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// HRM service routes
Route::prefix('hrm')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// CRM service routes
Route::prefix('crm')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Wallet service routes
Route::prefix('wallet')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// CMS service routes
Route::prefix('cms')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// User service routes
Route::prefix('user-management')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Settings service routes
Route::prefix('system')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Media service routes
Route::prefix('media')->middleware('auth.gateway')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Public service routes (no authentication)
Route::prefix('public')->group(function () {
    Route::any('{any}', [GatewayController::class, 'forward'])->where('any', '.*');
});

// Fallback for unmatched routes
Route::fallback(function () {
    return response()->json([
        'status' => false,
        'message' => 'Route not found',
        'errors' => [
            'route' => request()->path(),
        ],
    ], 404);
});
