<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/system/refresh', function () {

    Artisan::call('storage:link');
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    Artisan::call('optimize:clear');

    return response()->json([
        'status' => 'success',
        'message' => 'System refreshed successfully',
        'commands' => [
            'storage:link',
            'cache:clear',
            'config:clear',
            'config:cache',
            'route:clear',
            'view:clear',
            'optimize:clear',
        ]
    ]);
});
Route::get('/', function () {
    return view('welcome');
});

// Serve React static files (quotes.json, manifest, etc.)
Route::get('/{file}', function ($file) {
    $path = public_path('build/' . $file);

    if (!file_exists($path)) {
        abort(404);
    }

    // Determine content type
    $extension = pathinfo($path, PATHINFO_EXTENSION);
    $mimeTypes = [
        'json' => 'application/json',
        'webmanifest' => 'application/manifest+json',
        'js' => 'application/javascript',
        'css' => 'text/css',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
    ];

    $contentType = $mimeTypes[$extension] ?? 'application/octet-stream';

    return response()->file($path, ['Content-Type' => $contentType]);
})->where('file', '^(quotes\.json|manifest\.webmanifest|registerSW\.js|.*\.(png|jpg|jpeg|svg|ico|webmanifest))$');

// Catch-all route for React SPA
Route::get('/{any}', function () {
    return file_get_contents(public_path('build/index.html'));
})->where('any', '.*');
