<?php

/**
 * Quick Seed Script - Seeds essential data without running migrations
 * Run: php quick_seed.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "=== Quick Fresh Seed ===\n\n";

// 1. Permissions (326 permissions)
echo "1. Seeding Permissions...\n";
$permissionSeeder = new Database\Seeders\PermissionSeeder();
$permissionSeeder->run();
echo "   ✓ Permissions seeded\n\n";

// 2. Roles
echo "2. Seeding Roles...\n";
$roles = [
    ['name' => 'Super Admin', 'slug' => 'super_admin', 'description' => 'Full Access'],
    ['name' => 'Manager', 'slug' => 'manager', 'description' => 'Store & Staff Manager'],
    ['name' => 'Store Keeper', 'slug' => 'store_keeper', 'description' => 'Inventory Access Only'],
    ['name' => 'Wholesale Customer', 'slug' => 'wholesale_customer', 'description' => 'Bulk Buyer'],
    ['name' => 'Retail Customer', 'slug' => 'retail_customer', 'description' => 'Regular Web User'],
];
DB::table('roles')->insert($roles);
echo "   ✓ Roles seeded\n\n";

// 3. Assign all permissions to Super Admin
echo "3. Assigning permissions to Super Admin...\n";
$superAdmin = DB::table('roles')->where('slug', 'super_admin')->first();
if ($superAdmin) {
    $allPermissionIds = DB::table('permissions')->pluck('id');
    $existingPivot = DB::table('role_permission')
        ->where('role_id', $superAdmin->id)
        ->pluck('permission_id')
        ->toArray();

    $newPermissions = $allPermissionIds->diff($existingPivot);
    foreach ($newPermissions as $permissionId) {
        DB::table('role_permission')->insert([
            'role_id' => $superAdmin->id,
            'permission_id' => $permissionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    echo "   ✓ Super Admin has all permissions\n\n";
}

// 4. Units
echo "4. Seeding Units...\n";
$units = [
    ['name' => 'Piece', 'symbol' => 'pc', 'allow_decimal' => false],
    ['name' => 'Kilogram', 'symbol' => 'kg', 'allow_decimal' => true],
    ['name' => 'Dozen', 'symbol' => 'doz', 'allow_decimal' => false],
    ['name' => 'Liter', 'symbol' => 'ltr', 'allow_decimal' => true],
];
DB::table('units')->insert($units);
echo "   ✓ Units seeded\n\n";

// 5. Warehouses
echo "5. Seeding Warehouses...\n";
$warehouses = [
    ['name' => 'Guangzhou Hub', 'location' => 'China', 'type' => 'china'],
    ['name' => 'In Transit (Sea/Air)', 'location' => 'International Waters', 'type' => 'transit'],
    ['name' => 'Bogura Main Warehouse', 'location' => 'Bogura, BD', 'type' => 'local_hub'],
    ['name' => 'Dhaka Showroom', 'location' => 'Dhaka, BD', 'type' => 'showroom'],
];
DB::table('warehouses')->insert($warehouses);
echo "   ✓ Warehouses seeded\n\n";

// 6. Chart of Accounts
echo "6. Seeding Chart of Accounts...\n";
$accounts = [
    ['name' => 'Cash on Hand', 'code' => '1001', 'type' => 'asset'],
    ['name' => 'Bank Account', 'code' => '1002', 'type' => 'asset'],
    ['name' => 'Inventory Asset', 'code' => '1003', 'type' => 'asset'],
    ['name' => 'Accounts Payable', 'code' => '2001', 'type' => 'liability'],
    ['name' => 'Sales Revenue', 'code' => '4001', 'type' => 'income'],
    ['name' => 'Shipping Income', 'code' => '4002', 'type' => 'income'],
    ['name' => 'Cost of Goods Sold (COGS)', 'code' => '5001', 'type' => 'expense'],
    ['name' => 'Office Rent', 'code' => '5002', 'type' => 'expense'],
    ['name' => 'Salary Expense', 'code' => '5003', 'type' => 'expense'],
];
DB::table('chart_of_accounts')->insert($accounts);
echo "   ✓ Chart of Accounts seeded\n\n";

// 7. HRM Departments
echo "7. Seeding HRM Departments...\n";
$departments = [
    ['name' => 'Management', 'description' => 'Top-level management'],
    ['name' => 'Sales', 'description' => 'Sales department'],
    ['name' => 'Warehouse', 'description' => 'Warehouse operations'],
    ['name' => 'IT Support', 'description' => 'Technical support'],
];
DB::table('departments')->insert($departments);
echo "   ✓ Departments seeded\n\n";

// 8. Admin User (if not exists)
echo "8. Creating Admin User...\n";
$existingAdmin = DB::table('users')->where('email', 'admin@hooknhunt.com')->first();
if (!$existingAdmin) {
    $adminId = DB::table('users')->insertGetId([
        'name' => 'Super Admin',
        'email' => 'admin@hooknhunt.com',
        'phone_number' => '01700000000',
        'password' => Hash::make('password123'), // Default password
        'is_active' => true,
        'phone_verified_at' => now(),
        'role_id' => 1, // Super Admin
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    echo "   ✓ Admin user created (ID: {$adminId})\n";
    echo "   Email: admin@hooknhunt.com\n";
    echo "   Password: password123\n\n";
} else {
    echo "   ℹ️  Admin user already exists\n\n";
}

// 9. Settings
echo "9. Seeding Global Settings...\n";
$settings = [
    ['group' => 'profit', 'key' => 'margin_wholesale', 'value' => '20'],
    ['group' => 'profit', 'key' => 'margin_retail', 'value' => '50'],
    ['group' => 'profit', 'key' => 'margin_daraz', 'value' => '60'],
    ['group' => 'courier', 'key' => 'delivery_charge_dhaka', 'value' => '60'],
    ['group' => 'courier', 'key' => 'delivery_charge_outside', 'value' => '120'],
];
DB::table('settings')->insert($settings);
echo "   ✓ Settings seeded\n\n";

echo "=== ✅ Quick Seed Complete ===\n\n";
echo "Summary:\n";
echo "  • " . DB::table('permissions')->count() . " permissions\n";
echo "  • " . DB::table('roles')->count() . " roles\n";
echo "  • " . DB::table('departments')->count() . " departments\n";
echo "  • " . DB::table('units')->count() . " units\n";
echo "  • " . DB::table('warehouses')->count() . " warehouses\n";
echo "  • " . DB::table('users')->count() . " users\n";
echo "  • " . DB::table('settings')->count() . " settings\n\n";

echo "⚠️  IMPORTANT: Log in with:\n";
echo "   Email: admin@hooknhunt.com\n";
echo "   Password: password123\n\n";
