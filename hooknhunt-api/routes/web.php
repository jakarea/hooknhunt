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
