<?php

use Illuminate\Support\Facades\Route;
use Modules\Media\Http\Controllers\MediaController;

/*
|--------------------------------------------------------------------------
| Media Module - API Routes
|--------------------------------------------------------------------------
|
| Media file and folder management endpoints
| Prefix: /api/v2/media
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // ====================================================
    // Media Library Routes
    // ====================================================
    Route::prefix('media')->group(function () {
        // Folder management
        Route::get('folders', [MediaController::class, 'getFolders']);
        Route::post('folders', [MediaController::class, 'createFolder']);
        Route::put('folders/{id}', [MediaController::class, 'updateFolder']);
        Route::delete('folders/{id}', [MediaController::class, 'deleteFolder']);

        // File management
        Route::get('files', [MediaController::class, 'getFiles']);
        Route::get('files/{id}', [MediaController::class, 'getFile']);
        Route::put('files/{id}', [MediaController::class, 'updateFile']);
        Route::post('upload', [MediaController::class, 'upload']);
        Route::post('files/bulk-move', [MediaController::class, 'bulkMoveFiles']);
        Route::delete('files/bulk-delete', [MediaController::class, 'bulkDelete']);
    });

});

// Health Check (Always Public)
Route::get('media/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'media-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
