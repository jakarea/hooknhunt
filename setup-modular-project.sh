#!/bin/bash

# Setup Script: hooknhunt-modular
# Creates a fresh Laravel project with modular structure

echo "================================"
echo "Creating Hook & Hunt Modular"
echo "================================"
echo ""

BASE_DIR="/Applications/MAMP/htdocs/hooknhunt"
PROJECT_NAME="hooknhunt-modular"
PROJECT_PATH="$BASE_DIR/$PROJECT_NAME"

# Step 1: Create new Laravel project
echo "Step 1: Creating new Laravel project..."
cd "$BASE_DIR"

# Create Laravel project (using composer create-project)
composer create-project laravel/laravel "$PROJECT_NAME"

echo "✅ Laravel project created at: $PROJECT_PATH"
echo ""

# Step 2: Install Laravel Modules package
echo "Step 2: Installing Laravel Modules package..."
cd "$PROJECT_PATH"
composer require nwidart/laravel-modules:^11.0

echo "✅ Laravel Modules package installed"
echo ""

# Step 3: Publish module configuration
echo "Step 3: Publishing module configuration..."
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"

echo "✅ Module configuration published"
echo ""

# Step 4: Update composer.json autoload
echo "Step 4: Updating composer autoload..."
sed -i '' 's/"Database\\\\Seeders\\\\": "database\/seeders"/"Database\\\\Seeders\\\\": "database\/seeders",\
    "Modules\\\\": "Modules"/' composer.json

composer dump-autoload

echo "✅ Autoload updated"
echo ""

# Step 5: Create all modules
echo "Step 5: Creating modules..."
php artisan module:make Auth Catalog Finance Procurement Inventory Sales Logistics HRM CRM Wallet CMS Settings Media User

echo "✅ 14 modules created"
echo ""

# Step 6: Update .env for MAMP
echo "Step 6: Configuring .env for MAMP..."
sed -i '' 's/DB_HOST=127.0.0.1/DB_HOST=localhost/' .env
sed -i '' 's/DB_PORT=3306/DB_PORT=8889/' .env
sed -i '' 's/DB_DATABASE=laravel/DB_DATABASE=hooknhunt_modular/' .env
sed -i '' 's/DB_USERNAME=root/DB_USERNAME=root/' .env

echo "✅ .env configured for MAMP"
echo ""

# Step 7: Copy configuration files from monolith
echo "Step 7: Copying configurations from monolith..."
cp ../hooknhunt-api/.env.example .env.example.backup
# Copy any custom configs you need

echo "✅ Configurations copied"
echo ""

# Step 8: Create module registry in config/modules.php
echo "Step 8: Configuring modules..."
cat > config/modules.php << 'EOF'
<?php

return [
    'namespace' => 'Modules',
    'path' => base_path('Modules'),

    'stubs' => [
        'enabled' => false,
    ],

    'auto-discovery' => [
        'enabled' => true,
    ],

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

    'disabled' => [],
];
EOF

echo "✅ Modules configured"
echo ""

# Step 9: Update RouteServiceProvider
echo "Step 9: Updating RouteServiceProvider..."
cat > app/Providers/RouteServiceProvider.php << 'EOF'
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        parent::boot();
    }

    public function map(): void
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        $this->mapModuleRoutes();
    }

    protected function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }

    protected function mapApiRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
    }

    protected function mapModuleRoutes(): void
    {
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
EOF

echo "✅ RouteServiceProvider updated"
echo ""

# Step 10: Run migrations
echo "Step 10: Running migrations..."
php artisan migrate

echo "✅ Migrations complete"
echo ""

echo "================================"
echo "✅ SETUP COMPLETE!"
echo "================================"
echo ""
echo "Project location: $PROJECT_PATH"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_PATH"
echo "2. Start migrating code from hooknhunt-api/"
echo "3. Read MODULE_MIGRATION_GUIDE.md for instructions"
echo ""
echo "Start development server:"
echo "  cd $PROJECT_PATH"
echo "  php artisan serve"
echo ""
echo "Your modular API will be at: http://localhost:8000"
echo ""
