<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Api\V2\AuthController;
use App\Http\Controllers\Api\V2\RoleController;
use App\Http\Controllers\Api\V2\PermissionController;
use App\Http\Controllers\Api\V2\SettingController;
use App\Http\Controllers\Api\V2\UnitController;
use App\Http\Controllers\Api\V2\WarehouseController;
use App\Http\Controllers\Api\V2\UserController;
use App\Http\Controllers\Api\V2\SupplierController;
use App\Http\Controllers\Api\V2\CourierController;
use App\Http\Controllers\Api\V2\MediaController;
use App\Http\Controllers\Api\V2\CategoryController;
use App\Http\Controllers\Api\V2\BrandController;
use App\Http\Controllers\Api\V2\ProductController;
use App\Http\Controllers\Api\V2\PricingController;
use App\Http\Controllers\Api\V2\DiscountController;
use App\Http\Controllers\Api\V2\ShipmentController;
use App\Http\Controllers\Api\V2\InventoryController;
use App\Http\Controllers\Api\V2\AdjustmentController;
use App\Http\Controllers\Api\V2\CustomerController;
use App\Http\Controllers\Api\V2\PosController;
use App\Http\Controllers\Api\V2\OrderController;
use App\Http\Controllers\Api\V2\LoyaltyController;
use App\Http\Controllers\Api\V2\AffiliateController;
use App\Http\Controllers\Api\V2\AccountController;
use App\Http\Controllers\Api\V2\ExpenseController;
use App\Http\Controllers\Api\V2\JournalEntryController;
use App\Http\Controllers\Api\V2\ReportController;
use App\Http\Controllers\Api\V2\LandingPageController;
use App\Http\Controllers\Api\V2\MenuController;
use App\Http\Controllers\Api\V2\BannerController;
use App\Http\Controllers\Api\V2\TicketController;
use App\Http\Controllers\Api\V2\PublicController;
use App\Http\Controllers\Api\V2\NotificationController;
use App\Http\Controllers\Api\V2\DropshipController;
use App\Http\Controllers\Api\V2\ReturnController;
use App\Http\Controllers\Api\V2\PaymentController;
use App\Http\Controllers\Api\V2\ShipmentWorkflowController;
use App\Http\Controllers\Api\V2\ProductPricingController;
use App\Http\Controllers\Api\V2\SalesOrderController;
use App\Http\Controllers\Api\V2\InventorySortingController;
/*
|--------------------------------------------------------------------------
| API Routes V2 (Enterprise ERP)
|--------------------------------------------------------------------------
*/

// Include Legacy or External Routes if needed
if (file_exists(__DIR__.'/website.php')) require __DIR__.'/website.php';
if (file_exists(__DIR__.'/admin.php')) require __DIR__.'/admin.php';
if (file_exists(__DIR__.'/documentation.php')) require __DIR__.'/documentation.php';

// Debug Route
Route::get('/debug-routes', function () {
    return response()->json(['message' => 'API V2 Routes are active']);
});

// ====================================================
// GROUP 1: AUTHENTICATION (Public Access)
// ====================================================
Route::prefix('v2/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('login', [AuthController::class, 'login']);
});

// ====================================================
// GROUP 2: PROTECTED ERP ROUTES (Admin/Staff/User)
// ====================================================
Route::prefix('v2')->middleware(['auth:sanctum'])->group(function () {

    // --- Auth Management ---
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'profile']);
    Route::put('auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('auth/change-password', [AuthController::class, 'changePassword']);

    // --- Notifications ---
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/read', [NotificationController::class, 'markAsRead']);

    // --- Batch 1: Config & Roles ---
    Route::apiResource('roles', RoleController::class);
    Route::get('roles/{id}/permissions', [RoleController::class, 'getPermissions']);
    Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions']);
    Route::get('permissions', [PermissionController::class, 'list']);

    Route::get('settings', [SettingController::class, 'index']);
    Route::post('settings/update', [SettingController::class, 'update']);
    Route::get('settings/public', [SettingController::class, 'publicSettings'])->withoutMiddleware('auth:sanctum');

    Route::apiResource('units', UnitController::class);
    Route::get('helpers/units', [UnitController::class, 'dropdown']);

    Route::apiResource('warehouses', WarehouseController::class);
    Route::get('warehouses/{id}/stock-summary', [WarehouseController::class, 'stockSummary']);
    Route::post('warehouses/{id}/toggle-status', [WarehouseController::class, 'toggleStatus']);

    // --- Batch 2: Users & Partners ---
    Route::apiResource('users', UserController::class);
    Route::post('users/{id}/restore', [UserController::class, 'restore']);
    Route::post('users/{id}/ban', [UserController::class, 'banUser']);
    Route::get('helpers/users/staff-list', [UserController::class, 'staffDropdown']);

    Route::apiResource('suppliers', SupplierController::class);
    Route::get('suppliers/{id}/purchase-history', [SupplierController::class, 'purchaseHistory']);
    Route::get('suppliers/{id}/ledger', [SupplierController::class, 'ledger']);
    Route::get('helpers/suppliers', [SupplierController::class, 'dropdown']);

    Route::apiResource('couriers', CourierController::class);
    Route::post('couriers/{id}/test-api', [CourierController::class, 'testConnection']);
    Route::get('couriers/{id}/zone-rates', [CourierController::class, 'getZoneRates']);
    Route::post('couriers/zone-rates', [CourierController::class, 'updateZoneRates']);

    Route::get('media/folders', [MediaController::class, 'getFolders']);
    Route::post('media/folders', [MediaController::class, 'createFolder']);
    Route::get('media/files', [MediaController::class, 'getFiles']);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::delete('media/files/bulk-delete', [MediaController::class, 'bulkDelete']);

    // --- Batch 3: Product Catalog ---
    Route::apiResource('categories', CategoryController::class);
    Route::get('helpers/categories/tree', [CategoryController::class, 'treeStructure']);
    Route::post('categories/reorder', [CategoryController::class, 'reorder']);

    Route::apiResource('brands', BrandController::class);
    Route::get('helpers/brands', [BrandController::class, 'dropdown']);

    Route::apiResource('products', ProductController::class);
    Route::post('products/{id}/duplicate', [ProductController::class, 'duplicate']);
    Route::post('products/bulk-action', [ProductController::class, 'bulkAction']);
    Route::post('/products/{id}/suppliers', [ProductController::class, 'addSupplier']);
    Route::post('products/{id}/variants', [ProductController::class, 'storeVariant']);
    Route::put('variants/{id}', [ProductController::class, 'updateVariant']);
    Route::delete('variants/{id}', [ProductController::class, 'deleteVariant']);
    Route::get('helpers/generate-sku', [ProductController::class, 'generateSku']);

    Route::post('products/print-labels', [ProductController::class, 'generateBarcodePDF']);

    // --- Batch 4: Pricing ---
    Route::get('variants/{id}/channel-prices', [PricingController::class, 'getChannelPrices']);
    Route::post('variants/{id}/channel-prices', [PricingController::class, 'setChannelPrice']);
    Route::apiResource('discounts', DiscountController::class);
    Route::post('discounts/validate', [DiscountController::class, 'checkValidity']);

    // --- Batch 5: Sourcing & Import ---
    Route::apiResource('shipments', ShipmentController::class);
    Route::post('shipments/{id}/items', [ShipmentController::class, 'addItem']);
    Route::put('shipments/items/{itemId}', [ShipmentController::class, 'updateItem']);
    Route::delete('shipments/items/{itemId}', [ShipmentController::class, 'removeItem']);
    
    Route::get('shipments/{id}/costs', [ShipmentController::class, 'getCosts']);
    Route::post('shipments/{id}/costs', [ShipmentController::class, 'addCost']);
    Route::delete('shipments/costs/{costId}', [ShipmentController::class, 'removeCost']);

    Route::post('shipments/{id}/status/shipped', [ShipmentController::class, 'markAsShipped']);
    Route::post('shipments/{id}/status/customs', [ShipmentController::class, 'markInCustoms']);
    Route::post('shipments/{id}/status/arrived', [ShipmentController::class, 'markArrivedBogura']);
    Route::post('shipments/{id}/finalize-receive', [ShipmentController::class, 'finalizeShipment']);

    // --- Batch 6: Inventory (FIFO) ---
    Route::get('inventory/current-stock', [InventoryController::class, 'index']);
    Route::get('inventory/low-stock', [InventoryController::class, 'lowStockReport']);
    Route::get('inventory/batches/{variantId}', [InventoryController::class, 'batchHistory']);
    Route::post('inventory/batches/{id}/expiry', [InventoryController::class, 'updateExpiry']);
    
    Route::apiResource('inventory-adjustments', AdjustmentController::class);
    Route::post('inventory-adjustments/{id}/approve', [AdjustmentController::class, 'approve']);
    Route::get('inventory/ledger', [InventoryController::class, 'ledgerReport']);

    // --- Batch 7: Sales & POS ---
    Route::apiResource('customers', CustomerController::class);
    Route::get('customers/{id}/orders', [CustomerController::class, 'orderHistory']);
    Route::get('customers/search', [CustomerController::class, 'search']);

    Route::get('pos/products', [PosController::class, 'getProducts']);
    Route::post('pos/scan', [PosController::class, 'scanBarcode']);
    Route::post('pos/calculate', [PosController::class, 'calculateCart']);
    Route::post('pos/checkout', [PosController::class, 'checkout']);

    Route::apiResource('orders', OrderController::class);
    Route::get('orders/{id}/invoice', [OrderController::class, 'downloadInvoice']);
    Route::get('orders/{id}/tracking', [OrderController::class, 'trackingInfo']);
    Route::post('orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('orders/{id}/courier-push', [OrderController::class, 'sendToCourier']);
    Route::post('orders/{id}/payments', [OrderController::class, 'addPayment']);
    Route::post('orders/{id}/return', [OrderController::class, 'createReturn']);

    // --- Batch 8: CRM & Loyalty (UPDATED) ---
    // Loyalty - Fixed method names to match Controller
    Route::get('loyalty-rules', [LoyaltyController::class, 'index']);
    Route::post('loyalty-rules', [LoyaltyController::class, 'store']);
    Route::post('loyalty-rules/{id}/toggle', [LoyaltyController::class, 'toggleStatus']); 
    Route::delete('loyalty-rules/{id}', [LoyaltyController::class, 'destroy']);

    Route::post('customers/{id}/adjust-points', [LoyaltyController::class, 'manualAdjust']);

    // Affiliate (User Side)
    Route::post('affiliates/join', [AffiliateController::class, 'joinProgram']);
    Route::get('affiliates/dashboard', [AffiliateController::class, 'dashboard']);
    
    // Affiliate (Admin Side)
    Route::apiResource('affiliates', AffiliateController::class)->except(['store']); 
    Route::post('affiliates/{id}/approve', [AffiliateController::class, 'approve']);
    Route::post('affiliates/payouts/generate', [AffiliateController::class, 'generatePayouts']);

    // Support Tickets
    Route::apiResource('support-tickets', TicketController::class);
    Route::post('support-tickets/{id}/reply', [TicketController::class, 'reply']);
    Route::post('support-tickets/{id}/close', [TicketController::class, 'close']);


    // --- Batch 9: Accounts ---
    Route::apiResource('accounts', AccountController::class);
    Route::get('accounts/balance-summary', [AccountController::class, 'balanceSummary']);

    Route::apiResource('expenses', ExpenseController::class);
    Route::post('expenses/{id}/approve', [ExpenseController::class, 'approve']);
    Route::get('expenses/summary', [ExpenseController::class, 'monthlySummary']);

    Route::apiResource('journals', JournalEntryController::class);

    Route::get('reports/profit-loss', [ReportController::class, 'profitLoss']);
    Route::get('reports/balance-sheet', [ReportController::class, 'balanceSheet']);
    Route::get('reports/cash-flow', [ReportController::class, 'cashFlow']);
    Route::get('reports/daily-sales', [ReportController::class, 'dailySales']);

    // --- Batch 10: CMS ---
    Route::apiResource('landing-pages', LandingPageController::class);
    Route::post('landing-pages/{id}/sections', [LandingPageController::class, 'updateSections']);

    Route::apiResource('menus', MenuController::class);
    Route::apiResource('banners', BannerController::class);
    Route::post('banners/reorder', [BannerController::class, 'reorder']);


    Route::post('/returns', [ReturnController::class, 'store']); // Customer submits
    Route::post('/returns/{id}/approve', [ReturnController::class, 'approve']); // Admin approves

    // Payment & Cheque
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::post('/payments/cheque/{id}/reconcile', [PaymentController::class, 'reconcileCheque']);

    // Courier Integrations
    Route::post('/courier/book/{order_id}', [CourierController::class, 'bookOrder']);
    Route::get('/courier/status/{tracking_code}', [CourierController::class, 'checkStatus']);
    Route::post('/courier/bulk-status-check', [CourierController::class, 'bulkStatusUpdate']);
    
    // Order Helpers
    Route::post('/orders/{id}/mark-delivered', [OrderController::class, 'markAsDelivered']);
    
    // ==========================================
    // 🚢 NEW SHIPMENT WORKFLOW (Batch 19)
    // ==========================================
    
    // 1. Create Draft (Invoice View)
    Route::post('/shipment-workflow/draft', [ShipmentWorkflowController::class, 'createDraft']);

    // 2. Update Steps (Payment, Dispatch, Transit, Edit)
    Route::post('/shipment-workflow/{id}/update-step', [ShipmentWorkflowController::class, 'updateStep']);

    // 3. View Edit History (Audit Trail)
    Route::get('/shipment-workflow/{id}/history', [ShipmentWorkflowController::class, 'getHistory']);
    Route::get('/shipment-workflow/{id}', [ShipmentWorkflowController::class, 'show']);

    // Step 8-10: Final Receive
    Route::post('/shipment-workflow/{id}/receive', [ShipmentWorkflowController::class, 'receiveAtBogura']);

    Route::post('pricing/update', [ProductPricingController::class, 'updatePrices']);

    // ==========================================Sales Order Routes ==========================================

    // 1. Create Sales Order / Checkout
    Route::post('/sales/create', [SalesOrderController::class, 'store']);
    // Optional: Calculate before creating
    Route::post('/sales/calculate', [SalesOrderController::class, 'calculate']);

    Route::get('/inventory/unsorted', [InventorySortingController::class, 'getUnsortedBatches']);
    
    // Sort Stock Action
    Route::post('/inventory/sort', [InventorySortingController::class, 'sortStock']);

}); // END OF PROTECTED ROUTES

Route::middleware(['auth:sanctum'])->prefix('dropship')->group(function () {
    Route::get('/catalog', [DropshipController::class, 'catalog']);
    Route::post('/order', [DropshipController::class, 'placeOrder']);
    Route::get('/label/{id}', [DropshipController::class, 'printLabel']);
    
    // Config Update (Logo/Name)
    Route::post('/config', function(Request $request) {
        // Simple update logic for DropshipperConfig model
    });
});

// ====================================================
// GROUP 3: PUBLIC WEBSITE ROUTES (Storefront)
// ====================================================
Route::prefix('v2/public')->group(function () {
    Route::get('products', [PublicController::class, 'productList']);
    Route::get('products/{slug}', [PublicController::class, 'productDetail']);
    Route::get('categories', [PublicController::class, 'categories']);
    Route::get('menus/{slug}', [PublicController::class, 'menu']);
    Route::get('landing-pages/{slug}', [PublicController::class, 'page']);
    Route::get('settings/general', [PublicController::class, 'generalSettings']);
    
    // Customer Auth (Separate from Admin)
    Route::post('login', [AuthController::class, 'customerLogin']);
    Route::post('register', [AuthController::class, 'customerRegister']);
});