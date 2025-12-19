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

// Include Website Routes (Public Storefront API)
require __DIR__.'/website.php';

// Include Admin Routes (Admin Panel API)
require __DIR__.'/admin.php';