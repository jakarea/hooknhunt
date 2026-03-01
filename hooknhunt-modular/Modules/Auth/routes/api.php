<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;
use Modules\Auth\Http\Controllers\DebugAuthController;

/*
|--------------------------------------------------------------------------
| Auth Module - API Routes
|--------------------------------------------------------------------------
|
| All authentication and authorization endpoints
| Prefix: /api/v2/auth
|
*/

// ====================================================
// PUBLIC ROUTES (No Authentication Required)
// ====================================================
Route::group([
    'middleware' => ['throttle:5,1)'],
], function () {
    // User Registration
    Route::post('register', [AuthController::class, 'register']);

    // Super Admin Registration (special endpoint)
    Route::post('register-super-admin', [AuthController::class, 'registerSuperAdmin'])
        ->middleware('throttle:3,1');

    // OTP Verification
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);

    // Resend OTP
    Route::post('resend-otp', [AuthController::class, 'resendOtp'])
        ->middleware('throttle:1,1');

    // User Login
    Route::post('login', [AuthController::class, 'login']);

    // Customer Login
    Route::post('customer/login', [AuthController::class, 'customerLogin']);

    // Customer Registration
    Route::post('customer/register', [AuthController::class, 'customerRegister']);

    // DEBUG ROUTES - Remove in production
    Route::post('debug/login', [DebugAuthController::class, 'diagnosticLogin']);
    Route::get('debug/database', [DebugAuthController::class, 'databaseInfo']);
});

// ====================================================
// PROTECTED ROUTES (Authentication Required)
// ====================================================
Route::middleware(['auth:sanctum'])->group(function () {
    // User Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // Get Current User Profile
    Route::get('me', [AuthController::class, 'profile']);

    // Update User Profile
    Route::put('profile', [AuthController::class, 'updateProfile']);

    // Change Password
    Route::put('change-password', [AuthController::class, 'changePassword']);
});

// Health Check (Always Public)
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'auth-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
