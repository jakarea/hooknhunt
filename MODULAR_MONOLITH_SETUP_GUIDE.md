# Modular Monolith Setup Guide
## Laravel Modules for cPanel Hosting

**Status**: Ready to Implement
**Created**: 2026-02-28

---

## 🎯 What You'll Get

```
hooknhunt-api/
├── app/                          # Laravel core (keep minimal)
├── Modules/                      # ✨ NEW: All business modules
│   ├── Auth/                     # Authentication module
│   │   ├── App/
│   │   │   ├── Controllers/      # AuthController, OTPController
│   │   │   ├── Models/           # User, Otp
│   │   │   ├── Services/         # AuthService
│   │   │   └── Requests/         # LoginRequest, RegisterRequest
│   │   ├── Database/
│   │   │   └── migrations/       # create_users_table, etc.
│   │   ├── Routes/
│   │   │   └── api.php           # /api/auth/* routes
│   │   ├── Resources/            # API Resources
│   │   ├── config/               # Module config
│   │   ├── composer.json         # Module dependencies
│   │   └── module.json           # Module metadata
│   │
│   ├── Catalog/                  # Product catalog module
│   │   ├── App/
│   │   │   ├── Controllers/      # ProductController, CategoryController
│   │   │   ├── Models/           # Product, Category, Brand
│   │   │   └── Services/         # CatalogService
│   │   ├── Database/migrations/  # create_products_table, etc.
│   │   └── Routes/api.php        # /api/catalog/* routes
│   │
│   ├── Finance/                  # Finance module
│   ├── Procurement/              # Procurement module
│   ├── Inventory/                # Inventory module
│   ├── Sales/                    # Sales module
│   ├── Logistics/                # Logistics module
│   ├── HRM/                      # HRM module
│   ├── CRM/                      # CRM module
│   ├── Wallet/                   # Wallet module
│   ├── CMS/                      # CMS module
│   ├── Settings/                 # Settings module
│   ├── Media/                    # Media module
│   └── User/                     # User management module
│
├── routes/api.php                # Main routes file (will load module routes)
└── config/modules.php            # Modules configuration
```

---

## 📋 Module Structure (Each Module)

```
Modules/{ModuleName}/
├── App/
│   ├── Actions/              # Action classes (single-purpose classes)
│   ├── Collections/          # Custom collections
│   ├── Contracts/            # Interfaces
│   ├── Controllers/          # HTTP controllers
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Enums/                # PHP enums
│   ├── Exceptions/           # Module-specific exceptions
│   ├── Helpers/              # Helper functions
│   ├── Interfaces/           # Interfaces
│   ├── Jobs/                 # Queue jobs
│   ├── Listeners/            # Event listeners
│   ├── Models/               # Eloquent models
│   ├── Observers/            # Model observers
│   ├── Repositories/         # Repository pattern
│   ├── Resources/            # API resources (transformers)
│   ├── Rules/                # Validation rules
│   ├── Services/             # Business logic
│   ├── Traits/               # Reusable traits
│   └── View/Components/      # Blade components (if needed)
│
├── Config/                   # Module configuration files
│   └── config.php
│
├── Database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
│
├── Routes/
│   ├── api.php               # API routes
│   └── web.php               # Web routes (if needed)
│
├── Resources/
│   ├── views/                # Blade views (if needed)
│   └── lang/                 # Language files
│
├── Tests/
│   ├── Feature/              # Feature tests
│   └── Unit/                 # Unit tests
│
├── composer.json             # Module-specific dependencies
├── module.json               # Module metadata (name, version, etc.)
├── CHANGELOG.md              # Module changelog
└── README.md                 # Module documentation
```

---

## 🚀 Implementation Steps

### Step 1: Update Composer (Move modules to require)

**Problem**: Currently in `require-dev`, need in `require` for production.

```bash
cd hooknhunt-api

# Move nwidart/laravel-modules from require-dev to require
# Edit composer.json:

composer require nwidart/laravel-modules:^11.0

# Or manually edit composer.json:
# In "require" section, add: "nwidart/laravel-modules": "^11.0"
# In "require-dev" section, remove: "nwidart/laravel-modules": "*"

# Then run:
composer update
```

### Step 2: Publish Module Configuration

```bash
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"
```

This creates:
- `config/modules.php` - Modules configuration
- `Modules/` directory

### Step 3: Configure Modules

**File**: `config/modules.php`

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Module Namespace
    |--------------------------------------------------------------------------
    */
    'namespace' => 'Modules',

    /*
    |--------------------------------------------------------------------------
    | Module Directory
    |--------------------------------------------------------------------------
    */
    'path' => base_path('Modules'),

    /*
    |--------------------------------------------------------------------------
    | Module Stubs
    |--------------------------------------------------------------------------
    */
    'stubs' => [
        'enabled' => true,
        'path' => base_path('vendor/nwidart/laravel-modules/src/Commands/stubs'),
        'files' => [
            'routes/web' => 'Routes/web.php',
            'routes/api' => 'Routes/api.php',
            'views/index' => 'Resources/views/index.blade.php',
            'views/master' => 'Resources/views/layouts/master.blade.php',
            'scaffold/config' => 'Config/config.php',
            'composer' => 'composer.json',
            'assets' => 'webpack.mix.js',
            'module' => 'module.json',
            'routes' => 'Routes/api.php',
        ],
        'replacements' => [
            'LOWER_NAME' => 'lower_name',
            'STUDLY_NAME' => 'StudlyName',
            'MODULE_NAMESPACE' => 'Modules',
            'CLASS_NAMESPACE' => 'Modules\StudlyName',
            'APP_PATH' => 'app',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Auto-Discovery
    |--------------------------------------------------------------------------
    */
    'auto-discovery' => [
        'enabled' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Register Only Specific Modules
    |--------------------------------------------------------------------------
    */
    'register' => [
        'Auth',
        'Catalog',
        'Finance',
        'Procurement',
        'Inventory',
        'Sales',
        'Logistics',
        'HRM',
        'CRM',
        'Wallet',
        'CMS',
        'Settings',
        'Media',
        'User',
    ],

    /*
    |--------------------------------------------------------------------------
    | Disable Specific Modules
    |--------------------------------------------------------------------------
    */
    'disabled' => [
        // Add module names to disable (e.g., 'Wallet' to disable wallet module)
    ],
];
```

### Step 4: Create First Module

```bash
# Create Auth module
php artisan module:make Auth

# Create Catalog module
php artisan module:make Catalog

# Create Finance module
php artisan module:make Finance

# Create multiple modules at once
php artisan module:make Procurement Inventory Sales Logistics HRM CRM Wallet CMS Settings Media User
```

### Step 5: Module Migration Strategy

**Approach A: Fresh Modules (Recommended for Clean Start)**

Create new modules and move code manually:
- ✅ Clean structure
- ✅ No legacy code
- ❌ Requires moving code manually

**Approach B: Migrate Existing Code (Recommended for Your Case)**

Move existing controllers/models into modules:
- ✅ Keep existing functionality
- ✅ Gradual migration
- ⚠️ Need to update namespaces

### Step 6: Migrate Existing Code to Modules

**Example: Migrating Auth Module**

```bash
# 1. Create Auth module
php artisan module:make Auth

# 2. Move controllers
cd Modules/Auth
mkdir -p App/Controllers

# Copy from app/Http/Controllers/Api/V2/AuthController.php
# To: Modules/Auth/App/Controllers/AuthController.php

# 3. Update namespace in AuthController.php
# From: namespace App\Http\Controllers\Api\V2;
# To: namespace Modules\Auth\App\Controllers;

# 4. Move models
mkdir -p App/Models
cp ../../../app/Models/User.php App/Models/
cp ../../../app/Models/Otp.php App/Models/

# 5. Update namespace in models
# From: namespace App\Models;
# To: namespace Modules\Auth\App\Models;

# 6. Move requests
mkdir -p App/Requests
cp ../../../app/Http/Requests/Auth/* App/Requests/

# 7. Update namespace in requests

# 8. Move routes
# Copy auth routes from routes/api.php to Modules/Auth/Routes/api.php

# 9. Update module.json to enable loading
```

### Step 7: Load Module Routes

**File**: `app/Providers/RouteServiceProvider.php`

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Define the routes for the application.
     */
    public function map(): void
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        // Load module routes automatically
        $this->mapModuleRoutes();
    }

    /**
     * Define the "web" routes for the application.
     */
    protected function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     */
    protected function mapApiRoutes(): void
    {
        Route::middleware('api')
            ->group(base_path('routes/api.php'));
    }

    /**
     * Define the module routes.
     */
    protected function mapModuleRoutes(): void
    {
        // Load all enabled module routes
        foreach (config('modules.register', []) as $module) {
            $modulePath = base_path("Modules/{$module}/Routes/api.php");

            if (file_exists($modulePath)) {
                Route::middleware('api')
                    ->prefix("api/v2")
                    ->group($modulePath);
            }
        }
    }
}
```

### Step 8: Module Autoloading

**File**: `composer.json` (root)

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/",
            "Modules\\": "Modules/"
        }
    }
}
```

Then run:
```bash
composer dump-autoload
```

### Step 9: Disable/Delete Modules

**Disable a Module** (keeps files, but doesn't load):

```php
// config/modules.php
'disabled' => [
    'Wallet', // Disable wallet module
],
```

**Delete a Module** (remove completely):

```bash
php artisan module:delete Wallet

# Or manually:
rm -rf Modules/Wallet
```

---

## 📦 Module Dependencies

**Module**: `module.json`

```json
{
    "name": "Auth",
    "alias": "auth",
    "description": "Authentication and authorization module",
    "keywords": [],
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

**Module with Dependencies**:

```json
{
    "name": "Procurement",
    "requires": ["Catalog", "Inventory"]
}
```

---

## 🧪 Testing Modules

```bash
# Run tests for specific module
php artisan test --filter=Modules\\Auth\\Tests\\Feature\\AuthTest

# Run all module tests
php artisan test --modules

# Run tests for specific module
cd Modules/Auth
php artisan test
```

---

## 🚢 Deploying to cPanel

### Option 1: Deploy Everything Together

```bash
# On cPanel (via SSH or Git)
cd ~/public_html/api
git pull origin main

# Install/Update dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Clear caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Option 2: Deploy Specific Module Only

```bash
# Just copy the module folder
scp -r Modules/Auth user@server:/path/to/Modules/

# On server
cd ~/public_html/api
composer dump-autoload
php artisan optimize:clear
```

---

## 📋 Module Creation Checklist

For each module you create:

- [ ] Create module using `php artisan module:make ModuleName`
- [ ] Move controllers from `app/Http/Controllers/Api/V2/` to `Modules/ModuleName/App/Controllers/`
- [ ] Move models from `app/Models/` to `Modules/ModuleName/App/Models/`
- [ ] Move requests from `app/Http/Requests/` to `Modules/ModuleName/App/Requests/`
- [ ] Move resources from `app/Http/Resources/` to `Modules/ModuleName/App/Resources/`
- [ ] Update all namespaces (use find & replace)
- [ ] Move routes from `routes/api.php` to `Modules/ModuleName/Routes/api.php`
- [ ] Move migrations to `Modules/ModuleName/Database/migrations/`
- [ ] Update `module.json` with module info
- [ ] Create module service provider if needed
- [ ] Update `config/modules.php` to register module
- [ ] Run `composer dump-autoload`
- [ ] Test module endpoints
- [ ] Commit to Git

---

## 🎯 Next Steps

I can help you with:

1. **Create Auth module** - Migrate existing auth code
2. **Create Catalog module** - Migrate product catalog
3. **Create Finance module** - Migrate accounting
4. **Create all modules** - Migrate entire codebase
5. **Create migration script** - Automate the migration
6. **Create module template** - Reusable module scaffold

**Which would you like to start with?**
