<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes V2 (Enterprise Modular Architecture)
|--------------------------------------------------------------------------
*/

// ====================================================
// MODULE: AUTHENTICATION (Public)
// ====================================================
Route::group([
    'prefix' => 'v2/auth',
    'namespace' => 'App\Http\Controllers\Api\V2'
], function () {
    Route::post('register', 'AuthController@register')->middleware('throttle:5,1');
    Route::post('verify-otp', 'AuthController@verifyOtp')->middleware('throttle:5,1');
    Route::post('resend-otp', 'AuthController@resendOtp')->middleware('throttle:1,1');
    Route::post('login', 'AuthController@login')->middleware('throttle:5,1');
    Route::post('customer/login', 'AuthController@customerLogin')->middleware('throttle:5,1');
    Route::post('customer/register', 'AuthController@customerRegister')->middleware('throttle:5,1');
});

// ====================================================
// PROTECTED ROUTES (Middleware: Sanctum)
// ====================================================
Route::group([
    'prefix' => 'v2',
    'middleware' => ['auth:sanctum'],
    'namespace' => 'App\Http\Controllers\Api\V2'
], function () {

    // --- Profile & Personal Actions ---
    Route::post('auth/logout', 'AuthController@logout');
    Route::get('auth/me', 'AuthController@profile');
    Route::put('auth/profile', 'AuthController@updateProfile');
    Route::put('auth/change-password', 'AuthController@changePassword');
    Route::get('notifications', 'NotificationController@index');
    Route::post('notifications/read', 'NotificationController@markAsRead');

    // --- Module: SYSTEM & ACCESS CONTROL ---
    Route::group(['prefix' => 'system', 'middleware' => ['permission:system.manage']], function () {
        Route::apiResource('roles', 'RoleController');
        Route::get('roles/{id}/permissions', 'RoleController@getPermissions');
        Route::post('roles/{id}/sync-permissions', 'RoleController@syncPermissions');
        
        Route::post('permissions', 'PermissionController@store');
        Route::get('permissions', 'PermissionController@list');
        Route::apiResource('units', 'UnitController');
        Route::get('helpers/units', 'UnitController@dropdown');
        Route::apiResource('settings', 'SettingController');
        Route::post('settings/update', 'SettingController@update');
    });

    Route::group(['prefix' => 'user-management', 'middleware' => ['auth:sanctum']], function () {
        
        // শুধু ইউজার দেখার জন্য
        Route::get('users', 'UserController@index')->middleware('permission:user.index');

        Route::post('users', 'UserController@store')->middleware('permission:user.create');
        Route::get('users/{id}', 'UserController@show')->middleware('permission:user.index');

        // ইউজার ব্যান বা অ্যাকশন করার জন্য আলাদা পারমিশন
        Route::post('users/{id}/ban', 'UserController@banUser')->middleware('permission:user.ban');
        Route::post('users/{id}/restore', 'UserController@restore')->middleware('permission:user.ban');

        // ডাইরেক্ট পারমিশন দেওয়ার জন্য হাই-লেভেল এক্সেস
        Route::post('users/{id}/direct-permissions', 'UserController@giveDirectPermission')->middleware('permission:user.direct-access');
        // ইউজার ডিলিট করার জন্য DELETE রাউট
        Route::delete('users/{id}', 'UserController@destroy')->middleware('permission:user.delete');
        // ইউজার আপডেট করার জন্য PUT রাউট
        Route::put('users/{id}', 'UserController@update')->middleware('permission:user.edit');
        Route::post('users/{id}/block-permission', 'UserController@blockPermission')->middleware('permission:user.direct-access');
        
        // Supplier management
        Route::apiResource('suppliers', 'SupplierController')->middleware('permission:supplier.manage');
    });

    // --- Module: MEDIA ASSETS ---
    Route::group(['prefix' => 'media', 'middleware' => ['permission:media.manage']], function () {
        Route::get('folders', 'MediaController@getFolders');
        Route::post('folders', 'MediaController@createFolder');
        Route::get('files', 'MediaController@getFiles');
        Route::post('upload', 'MediaController@upload');
        Route::delete('files/bulk-delete', 'MediaController@bulkDelete');
    });

    // --- Module: PRODUCT CATALOG ---
    Route::group(['prefix' => 'catalog', 'middleware' => ['permission:product.manage']], function () {
        Route::apiResource('categories', 'CategoryController');
        Route::get('helpers/categories/tree', 'CategoryController@treeStructure');
        Route::apiResource('brands', 'BrandController');
        Route::apiResource('products', 'ProductController');
        Route::post('products/{id}/duplicate', 'ProductController@duplicate');
        Route::post('products/{id}/variants', 'ProductController@storeVariant');
        Route::get('variants/{id}/channel-prices', 'PricingController@getChannelPrices');
        Route::post('variants/{id}/channel-prices', 'PricingController@setChannelPrice');
        Route::post('pricing/update', 'ProductPricingController@updatePrices');
        Route::apiResource('discounts', 'DiscountController');
    });

    // --- Module: INVENTORY ---
    Route::group(['prefix' => 'inventory', 'middleware' => ['permission:inventory.manage']], function () {
        Route::apiResource('warehouses', 'WarehouseController');
        Route::get('current-stock', 'InventoryController@index');
        Route::get('low-stock', 'InventoryController@lowStockReport');
        Route::get('ledger', 'InventoryController@ledgerReport');
        Route::get('unsorted', 'InventorySortingController@getUnsortedBatches');
        Route::post('sort', 'InventorySortingController@sortStock');
        Route::apiResource('adjustments', 'AdjustmentController');
    });

    // --- Module: SALES & POS ---
    Route::group(['prefix' => 'sales', 'middleware' => ['permission:sales.manage']], function () {
        Route::apiResource('customers', 'CustomerController');
        Route::get('customers/{id}/orders', 'CustomerController@orderHistory');
        Route::group(['prefix' => 'pos'], function() {
            Route::get('products', 'PosController@getProducts');
            Route::post('scan', 'PosController@scanBarcode');
            Route::post('checkout', 'PosController@checkout');
        });
        Route::post('orders/create', 'SalesOrderController@store');
        Route::apiResource('orders', 'OrderController');
        Route::post('orders/{id}/status', 'OrderController@updateStatus');
        Route::post('orders/{id}/courier-push', 'OrderController@sendToCourier');
        Route::post('returns', 'ReturnController@store');
    });

    // --- Module: LOGISTICS ---
    Route::group(['prefix' => 'logistics', 'middleware' => ['permission:shipment.manage']], function () {
        Route::apiResource('shipments', 'ShipmentController');
        Route::group(['prefix' => 'workflow'], function() {
            Route::post('draft', 'ShipmentWorkflowController@createDraft');
            Route::post('{id}/update-step', 'ShipmentWorkflowController@updateStep');
            Route::post('{id}/receive', 'ShipmentWorkflowController@receiveAtBogura');
        });
        Route::apiResource('couriers', 'CourierController');
        Route::post('courier/book/{order_id}', 'CourierController@bookOrder');
    });

    // --- Module: HRM & PAYROLL ---
    Route::group(['prefix' => 'hrm', 'namespace' => 'Hrm', 'middleware' => ['permission:hrm.manage']], function() {
        Route::apiResource('departments', 'DepartmentController');
        Route::apiResource('employees', 'EmployeeController');
        Route::post('clock-in', 'AttendanceController@clockIn');
        Route::post('clock-out', 'AttendanceController@clockOut');
        Route::apiResource('leaves', 'LeaveController');
        Route::get('payrolls', 'PayrollController@index');
        Route::post('payrolls/generate', 'PayrollController@generate');
        Route::post('payrolls/{id}/pay', 'PayrollController@pay');
    });

    // --- Module: CRM ---
    Route::group(['prefix' => 'crm', 'namespace' => 'Crm', 'middleware' => ['permission:crm.manage']], function() {
        Route::apiResource('leads', 'LeadController');
        Route::post('activities', 'ActivityController@store');
        Route::post('activities/{id}/done', 'ActivityController@markAsDone');
        Route::post('segments/auto-run', 'CampaignController@runAutoSegmentation');
        Route::post('campaigns', 'CampaignController@store');
        Route::get('campaigns/{id}/generate-pdf', 'CampaignController@generatePdf');
    });

    // --- Module: FINANCE ---
    Route::group(['prefix' => 'finance', 'middleware' => ['permission:account.manage']], function () {
        Route::apiResource('accounts', 'AccountController');
        Route::apiResource('expenses', 'ExpenseController');
        Route::apiResource('journals', 'JournalEntryController');
        Route::get('reports/profit-loss', 'ReportController@profitLoss');
    });

    // --- Module: CMS & SUPPORT ---
    Route::group(['prefix' => 'cms', 'middleware' => ['permission:support.manage']], function () {
        Route::apiResource('support-tickets', 'TicketController');
        Route::apiResource('landing-pages', 'LandingPageController');
        Route::apiResource('menus', 'MenuController');
        Route::apiResource('banners', 'BannerController');
        Route::post('payment/bkash/init/{order_id}', 'PaymentController@payWithBkash');
    });

    // --- Others ---
    Route::get('loyalty-rules', 'LoyaltyController@index');
    Route::apiResource('affiliates', 'AffiliateController');

});

// ====================================================
// MODULE: AUDIT LOGS (Admin Control)
// ====================================================
Route::group([
    'prefix' => 'v2/admin',
    'namespace' => 'App\Http\Controllers\Api\V2',
    'middleware' => ['auth:sanctum']
], function () {
    Route::get('audit-logs', 'AuditController@index')->middleware('permission:audit.view');
    Route::get('audit-logs/{fileName}/preview', 'AuditController@preview')->middleware('permission:audit.view');
    Route::get('audit-logs/{fileName}/download', 'AuditController@download')->middleware('permission:audit.download');
    Route::delete('audit-logs/{fileName}', 'AuditController@destroy')->middleware('permission:audit.delete');
});

// ====================================================
// MODULE: PUBLIC (Guest Access)
// ====================================================
Route::group([
    'prefix' => 'v2/public',
    'namespace' => 'App\Http\Controllers\Api\V2'
], function () {
    Route::get('products', 'PublicController@productList');
    Route::get('products/{slug}', 'PublicController@productDetail');
    Route::get('categories', 'PublicController@categories');
    Route::post('crm/leads/checkout-capture', 'Crm\LeadController@captureCheckoutLead');
});