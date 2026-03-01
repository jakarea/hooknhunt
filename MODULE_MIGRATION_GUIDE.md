# Module Migration Guide
## Step-by-Step Code Migration to Modular Structure

**Target**: Migrate existing `app/Http/Controllers/Api/V2/` code to `Modules/` structure

---

## 📋 Module Mapping

| Current Route Prefix | Module Name | Controllers to Migrate |
|---------------------|-------------|----------------------|
| `/api/v2/auth/*` | **Auth** | AuthController, DebugAuthController |
| `/api/v2/system/*` | **Settings** | SettingController, UnitController, System controllers |
| `/api/v2/user-management/*` | **User** | UserController, RoleController, PermissionController, SupplierController |
| `/api/v2/media/*` | **Media** | MediaController |
| `/api/v2/catalog/*` | **Catalog** | ProductController, CategoryController, BrandController, AttributeController, DiscountController, PricingController |
| `/api/v2/inventory/*` | **Inventory** | InventoryController, WarehouseController, AdjustmentController, InventorySortingController |
| `/api/v2/sales/*` | **Sales** | CustomerController, OrderController, PosController, ReturnController, SalesOrderController |
| `/api/v2/logistics/*` | **Logistics** | ShipmentController, ShipmentWorkflowController, CourierController, PaymentController |
| `/api/v2/hrm/*` | **HRM** | Staff/ (all HRM controllers), Attendance, Leave, Payroll |
| `/api/v2/crm/*` | **CRM** | Crm/ (Customer, Lead, Activity, Campaign controllers) |
| `/api/v2/wallet/*` | **Wallet** | WalletController |
| `/api/v2/finance/*` | **Finance** | Finance, Account, Bank, Budget, Expense, Journal, Report, etc. |
| `/api/v2/cms/*` | **CMS** | TicketController, LandingPageController, MenuController, BannerController |
| `/api/v2/procurement/*` | **Procurement** | ProcurementController, PurchaseOrderController |

---

## 🔄 Migration Process (Per Module)

### Example: Migrating Auth Module

#### 1. Create the Module

```bash
cd hooknhunt-api
php artisan module:make Auth
```

This creates:
```
Modules/
└── Auth/
    ├── App/
    │   ├── Controllers/
    │   ├── Models/
    │   └── Services/
    ├── Database/
    │   ├── migrations/
    │   ├── factories/
    │   └── seeders/
    ├── Routes/
    │   ├── api.php
    │   └── web.php
    ├── Resources/
    ├── Config/
    ├── Tests/
    ├── composer.json
    └── module.json
```

#### 2. Move Controllers

**From**: `app/Http/Controllers/Api/V2/AuthController.php`
**To**: `Modules/Auth/App/Controllers/AuthController.php`

```bash
# Copy controller
cp app/Http/Controllers/Api/V2/AuthController.php Modules/Auth/App/Controllers/AuthController.php

# Edit the file
nano Modules/Auth/App/Controllers/AuthController.php
```

**Update Namespace**:

```php
// ❌ OLD (wrong)
namespace App\Http\Controllers\Api\V2;

// ✅ NEW (correct)
namespace Modules\Auth\App\Controllers;

use Illuminate\Http\Request;
// ... rest of imports
```

#### 3. Move Models

```bash
# Copy User model
cp app/Models/User.php Modules/Auth/App/Models/User.php

# Copy Otp model
cp app/Models/Otp.php Modules/Auth/App/Models/Otp.php
```

**Update Namespace in Models**:

```php
// ❌ OLD
namespace App\Models;

// ✅ NEW
namespace Modules\Auth\App\Models;
```

#### 4. Move Requests

```bash
# Create Requests directory
mkdir -p Modules/Auth/App/Requests

# Copy auth requests
cp app/Http/Requests/Auth/*.php Modules/Auth/App/Requests/
```

**Update Namespace in Requests**:

```php
// ❌ OLD
namespace App\Http\Requests\Auth;

// ✅ NEW
namespace Modules\Auth\App\Requests;
```

#### 5. Move Routes

**Extract auth routes from** `routes/api.php`:

```php
// routes/api.php (OLD - remove these lines)
Route::group(['prefix' => 'v2/auth'], function () {
    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@login');
    Route::post('verify-otp', 'AuthController@verifyOtp');
    // ... other auth routes
});
```

**Add to** `Modules/Auth/Routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\App\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Auth Module Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('register-super-admin', [AuthController::class, 'registerSuperAdmin']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('customer/login', [AuthController::class, 'customerLogin']);
    Route::post('customer/register', [AuthController::class, 'customerRegister']);

    // DEBUG ROUTES - Remove in production
    Route::post('debug/login', [DebugAuthController::class, 'diagnosticLogin']);
    Route::get('debug/database', [DebugAuthController::class, 'databaseInfo']);

    // Protected routes
    Route::middleware(['auth'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('change-password', [AuthController::class, 'changePassword']);
    });
});
```

#### 6. Move Migrations

```bash
# Find auth-related migrations
ls database/migrations/ | grep -E "users|otps|password"

# Copy to module
cp database/migrations/*_create_users_table.php Modules/Auth/Database/migrations/
cp database/migrations/*_create_otps_table.php Modules/Auth/Database/migrations/
```

#### 7. Update Module Configuration

**File**: `Modules/Auth/module.json`

```json
{
    "name": "Auth",
    "alias": "auth",
    "description": "Authentication and authorization module",
    "keywords": ["auth", "login", "register"],
    "priority": 1,
    "providers": [
        "Modules\\Auth\\Providers\\AuthServiceProvider"
    ],
    "aliases": {},
    "files": [],
    "requires": [],
    "version": "1.0.0"
}
```

#### 8. Create Module Service Provider

**File**: `Modules/Auth/App/Providers/AuthServiceProvider.php`

```php
<?php

namespace Modules\Auth\App\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Auth\App\Models\User;
use Modules\Auth\App\Models\Otp;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Load module routes
        $this->loadRoutesFrom(__DIR__.'/../../Routes/api.php');

        // Load module migrations
        $this->loadMigrationsFrom(__DIR__.'/../../Database/migrations');

        // Load module views (if any)
        $this->loadViewsFrom(__DIR__.'/../../Resources/views', 'auth');

        // Publish module assets (if any)
        $this->publishes([
            __DIR__.'/../../Resources/assets' => public_path('modules/auth'),
        ], 'auth-assets');
    }
}
```

#### 9. Register Module in Config

**File**: `config/modules.php`

```php
return [
    'namespace' => 'Modules',
    'path' => base_path('Modules'),

    // Auto-discovery (recommended)
    'auto-discovery' => [
        'enabled' => true,
    ],

    // Explicitly register these modules
    'register' => [
        'Auth',           // ✅ Add this
        'Catalog',
        'Finance',
        // ... other modules
    ],

    // Disabled modules
    'disabled' => [
        // 'Wallet', // Disable a module
    ],
];
```

#### 10. Update Root Composer Autoload

**File**: `composer.json` (root)

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/",
            "Modules\\": "Modules/"  // ✅ Add this
        }
    }
}
```

Then run:
```bash
composer dump-autoload
```

#### 11. Test the Module

```bash
# Clear caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# Check if routes are loaded
php artisan route:list | grep auth

# Test registration endpoint
curl -X POST http://localhost:8000/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"01712345678","password":"password123"}'
```

---

## 📦 Complete Module List & Migration Commands

### 1. Auth Module
```bash
php artisan module:make Auth

# Move:
# - Controllers: AuthController, DebugAuthController
# - Models: User, Otp
# - Requests: Auth/*
# - Routes: /api/v2/auth/*
```

### 2. Settings Module
```bash
php artisan module:make Settings

# Move:
# - Controllers: SettingController, UnitController, System/*
# - Models: Setting, Unit
# - Routes: /api/v2/system/*
```

### 3. User Module
```bash
php artisan module:make User

# Move:
# - Controllers: UserController, RoleController, PermissionController, SupplierController
# - Models: User (if not in Auth), Role, Permission, Supplier
# - Routes: /api/v2/user-management/*
```

### 4. Media Module
```bash
php artisan module:make Media

# Move:
# - Controllers: MediaController
# - Models: MediaFile, MediaFolder
# - Routes: /api/v2/media/*
```

### 5. Catalog Module
```bash
php artisan module:make Catalog

# Move:
# - Controllers: ProductController, CategoryController, BrandController, AttributeController, DiscountController, PricingController
# - Models: Product, Category, Brand, Attribute, AttributeOption, Discount
# - Requests: Catalog/*
# - Routes: /api/v2/catalog/*
```

### 6. Inventory Module
```bash
php artisan module:make Inventory

# Move:
# - Controllers: InventoryController, WarehouseController, AdjustmentController, InventorySortingController
# - Models: Inventory, Warehouse, InventoryAdjustment, InventorySorting
# - Routes: /api/v2/inventory/*
```

### 7. Procurement Module
```bash
php artisan module:make Procurement

# Move:
# - Controllers: ProcurementController, PurchaseOrderController
# - Models: PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatusHistory
# - Routes: /api/v2/procurement/*
```

### 8. Sales Module
```bash
php artisan module:make Sales

# Move:
# - Controllers: CustomerController, OrderController, PosController, ReturnController, SalesOrderController
# - Models: Customer, Order, OrderItem, ReturnRequest, SalesOrder
# - Routes: /api/v2/sales/*
```

### 9. Logistics Module
```bash
php artisan module:make Logistics

# Move:
# - Controllers: ShipmentController, ShipmentWorkflowController, CourierController
# - Models: Shipment, ShipmentItem, ShipmentHistory, Courier
# - Routes: /api/v2/logistics/*
```

### 10. Finance Module
```bash
php artisan module:make Finance

# Move:
# - Controllers: FinanceController, AccountController, BankController, BudgetController, ExpenseController, JournalEntryController, ReportController
# - Models: ChartOfAccount, JournalEntry, JournalItem, Expense, Bank, Budget
# - Routes: /api/v2/finance/*
```

### 11. HRM Module
```bash
php artisan module:make HRM

# Move:
# - Controllers: Hrm/* (Staff, Department, Attendance, Leave, Payroll)
# - Models: StaffProfile, Department, Attendance, Leave, Payroll
# - Routes: /api/v2/hrm/*
```

### 12. CRM Module
```bash
php artisan module:make CRM

# Move:
# - Controllers: Crm/* (Customer, Lead, Activity, Campaign)
# - Models: Lead, CrmActivity, CrmCampaign, CrmSegment
# - Routes: /api/v2/crm/*
```

### 13. Wallet Module
```bash
php artisan module:make Wallet

# Move:
# - Controllers: WalletController
# - Models: Wallet, WalletTransaction
# - Routes: /api/v2/wallet/*
```

### 14. CMS Module
```bash
php artisan module:make CMS

# Move:
# - Controllers: TicketController, LandingPageController, MenuController, BannerController
# - Models: SupportTicket, LandingPage, Menu, Banner
# - Routes: /api/v2/cms/*
```

---

## ⚠️ Common Migration Issues & Solutions

### Issue 1: Class Not Found

**Error**: `Class 'Modules\Auth\App\Controllers\AuthController' not found`

**Solution**:
```bash
# Clear autoload
composer dump-autoload

# Clear config
php artisan config:clear
```

### Issue 2: Route Not Found

**Error**: Route not defined for `/api/v2/auth/login`

**Solution**:
1. Check `Modules/Auth/Routes/api.php` exists
2. Check `config/modules.php` has `'Auth'` in register array
3. Run `php artisan config:clear`
4. Run `php artisan route:list` to verify

### Issue 3: Model Not Found

**Error**: `Class 'Modules\Auth\App\Models\User' not found`

**Solution**:
1. Check namespace in model file
2. Check `composer.json` has `"Modules\\": "Modules/"`
3. Run `composer dump-autoload`

### Issue 4: Migration Conflicts

**Error**: Two modules create `users` table

**Solution**:
- Users table should be in **Auth module ONLY**
- Other modules should use foreign keys (`user_id`) without constraints
- Or use table prefixes: `auth_users`, `crm_users` (not recommended)

---

## 🚀 Deployment to cPanel

### After Migration is Complete

```bash
# 1. Commit to Git
git add .
git commit -m "Migrate to modular structure"
git push origin main

# 2. On cPanel server
cd ~/public_html/api
git pull origin main

# 3. Install dependencies
composer install --no-dev --optimize-autoloader

# 4. Run migrations
php artisan migrate --force

# 5. Clear and cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Done!
```

---

## 📋 Migration Checklist

For each module:

- [ ] Create module using `php artisan module:make ModuleName`
- [ ] Move controllers from `app/Http/Controllers/Api/V2/` to `Modules/ModuleName/App/Controllers/`
- [ ] Update controller namespaces
- [ ] Move models from `app/Models/` to `Modules/ModuleName/App/Models/`
- [ ] Update model namespaces
- [ ] Move requests from `app/Http/Requests/` to `Modules/ModuleName/App/Requests/`
- [ ] Update request namespaces
- [ ] Move resources from `app/Http/Resources/` to `Modules/ModuleName/App/Resources/`
- [ ] Extract routes from `routes/api.php` to `Modules/ModuleName/Routes/api.php`
- [ ] Move migrations to `Modules/ModuleName/Database/migrations/`
- [ ] Create/update module service provider
- [ ] Update `config/modules.php`
- [ ] Run `composer dump-autoload`
- [ ] Clear all caches
- [ ] Test module endpoints
- [ ] Commit to Git

---

## 🎯 Ready to Start?

I can help you migrate modules one by one. Which would you like to start with?

1. **Auth module** (first, foundation for everything)
2. **Catalog module** (products, categories)
3. **Settings module** (system settings)
4. **All modules at once** (I'll create a migration script)

**Tell me which option you prefer!**
