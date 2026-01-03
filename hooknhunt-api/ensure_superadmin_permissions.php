<?php

/**
 * Quick script to ensure Super Admin (role_id: 1) has all permissions
 * Run: php ensure_superadmin_permissions.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\Role;
use App\Models\Permission;

echo "=== Super Admin Permission Sync ===\n\n";

// Get Super Admin role
$superAdmin = Role::find(1);

if (!$superAdmin) {
    echo "ERROR: Super Admin role (id: 1) not found!\n";
    exit(1);
}

echo "Role: {$superAdmin->name}\n";

// Count total permissions
$totalPermissions = Permission::count();
echo "Total permissions in database: {$totalPermissions}\n";

// Count current permissions
$currentCount = $superAdmin->permissions()->count();
echo "Current permissions assigned: {$currentCount}\n";

// Sync all permissions
$allPermissionIds = Permission::pluck('id');
$superAdmin->permissions()->sync($allPermissionIds);

$newCount = $superAdmin->permissions()->count();
echo "Permissions after sync: {$newCount}\n";

if ($newCount === $totalPermissions) {
    echo "\n✅ SUCCESS: Super Admin now has ALL permissions!\n";
    exit(0);
} else {
    echo "\n⚠️  WARNING: Permission count mismatch!\n";
    exit(1);
}
