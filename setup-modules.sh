#!/bin/bash

# Laravel Modules Migration Script
# This script helps migrate your existing monolith to modular structure

echo "================================"
echo "Laravel Modules Migration Script"
echo "================================"
echo ""

PROJECT_ROOT="/Applications/MAMP/htdocs/hooknhunt/hooknhunt-api"
cd "$PROJECT_ROOT"

# Step 1: Update composer.json
echo "Step 1: Updating composer.json..."
echo "- Moving nwidart/laravel-modules to require"
# This will be done manually (show instructions)

# Step 2: Install packages
echo ""
echo "Step 2: Installing packages..."
composer require nwidart/laravel-modules:^11.0

# Step 3: Publish config
echo ""
echo "Step 3: Publishing module configuration..."
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"

# Step 4: Update autoload
echo ""
echo "Step 4: Updating composer autoload..."
# Update composer.json manually to include Modules namespace
# Then run:
composer dump-autoload

# Step 5: Create modules
echo ""
echo "Step 5: Creating modules..."
echo "Creating: Auth, Catalog, Finance, Procurement, Inventory, Sales, Logistics, HRM, CRM, Wallet, CMS, Settings, Media, User"
php artisan module:make Auth Catalog Finance Procurement Inventory Sales Logistics HRM CRM Wallet CMS Settings Media User

echo ""
echo "✅ Module structure created!"
echo ""
echo "Next steps:"
echo "1. Move code from app/ to Modules/ModuleName/App/"
echo "2. Update namespaces in all files"
echo "3. Move routes from routes/api.php to Modules/ModuleName/Routes/api.php"
echo "4. Test each module"
echo ""
echo "See MODULAR_MONOLITH_SETUP_GUIDE.md for detailed instructions."
