<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\RoleController;
use Modules\User\Http\Controllers\PermissionController;
use Modules\User\Http\Controllers\SupplierController;

/*
|--------------------------------------------------------------------------
| User Module - API Routes
|--------------------------------------------------------------------------
|
| User management, roles, permissions, and suppliers endpoints
| Prefix: /api/v2/user-management
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // ====================================================
    // Users Management
    // ====================================================
    Route::prefix('user-management')->group(function () {
        // Users CRUD
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);

        // User Actions
        Route::post('users/{id}/ban', [UserController::class, 'banUser']);
        Route::post('users/{id}/restore', [UserController::class, 'restore']);
        Route::post('users/{id}/direct-permissions', [UserController::class, 'giveDirectPermission']);
        Route::post('users/{id}/block-permission', [UserController::class, 'blockPermission']);
        Route::put('users/{id}/permissions/granted', [UserController::class, 'syncGrantedPermissions']);
        Route::put('users/{id}/permissions/blocked', [UserController::class, 'syncBlockedPermissions']);

        // Role & Permission Lists
        Route::get('roles', [UserController::class, 'roleList']);
        Route::get('permissions', [PermissionController::class, 'list']);

        // Suppliers
        Route::apiResource('suppliers', SupplierController::class);
    });

    // ====================================================
    // Roles Management (HRM prefix, but belongs to User module)
    // ====================================================
    Route::prefix('hrm')->group(function () {
        // Custom routes must come before apiResource
        Route::get('roles/trashed', [RoleController::class, 'trashed']);
        Route::post('roles/{id}/restore', [RoleController::class, 'restore']);
        Route::delete('roles/{id}/force-delete', [RoleController::class, 'forceDelete']);
        Route::get('roles/{id}/permissions', [RoleController::class, 'getPermissions']);
        Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions']);
        Route::apiResource('roles', RoleController::class);

        // Permissions
        Route::post('permissions', [PermissionController::class, 'store']);
        Route::get('permissions', [PermissionController::class, 'list']);
        Route::get('permissions/grouped', [PermissionController::class, 'grouped']);
    });
});

// Health Check (Always Public)
Route::get('user-management/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'user-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
