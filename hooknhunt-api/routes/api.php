<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use Illuminate\Support\Facades\Route;

// Include Website Routes (Public Storefront API)
require __DIR__.'/website.php';

// Include Admin Routes (Admin Panel API)
require __DIR__.'/admin.php';

// Include Documentation Routes
require __DIR__.'/documentation.php';

// Debug route
Route::get('/debug-routes', function () {
    return response()->json(['message' => 'Routes are working']);
});