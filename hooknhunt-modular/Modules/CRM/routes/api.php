<?php

use Illuminate\Support\Facades\Route;
use Modules\CRM\Http\Controllers\LeadController;
use Modules\CRM\Http\Controllers\CustomerController;
use Modules\CRM\Http\Controllers\ActivityController;
use Modules\CRM\Http\Controllers\CampaignController;

/*
|--------------------------------------------------------------------------
| CRM Module - API Routes
|--------------------------------------------------------------------------
|
| Customer Relationship Management endpoints
| Prefix: /api/v2/crm
|
*/

Route::middleware(['auth:sanctum'])->group(function () {

    // ====================================================
    // CRM Routes
    // ====================================================
    Route::prefix('crm')->group(function () {
        // Statistics
        Route::get('stats', [LeadController::class, 'getStats']);

        // Leads management
        Route::apiResource('leads', LeadController::class);

        // Customers (CRM-specific)
        Route::apiResource('customers', CustomerController::class, [
            'names' => [
                'index' => 'crm.customers.index',
                'show' => 'crm.customers.show',
                'store' => 'crm.customers.store',
                'update' => 'crm.customers.update',
                'destroy' => 'crm.customers.destroy',
            ]
        ]);
        Route::post('customers/{id}/send-password-sms', [CustomerController::class, 'sendPasswordSms']);

        // Activities
        Route::post('activities', [ActivityController::class, 'store']);
        Route::post('activities/{id}/done', [ActivityController::class, 'markAsDone']);

        // Campaigns & Segments
        Route::post('segments/auto-run', [CampaignController::class, 'runAutoSegmentation']);
        Route::post('campaigns', [CampaignController::class, 'store']);
        Route::get('campaigns/{id}/generate-pdf', [CampaignController::class, 'generatePdf']);
    });

});

// Health Check (Always Public)
Route::get('crm/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'crm-module',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
