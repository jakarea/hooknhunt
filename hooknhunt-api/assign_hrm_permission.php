<?php

/**
 * Assign hrm.manage permission to role_id: 7
 * Run: php assign_hrm_permission.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\Role;
use App\Models\Permission;

echo "=== Assign HRM Manage Permission to Role ID 7 ===\n\n";

// Get role
$role = Role::find(7);

if (!$role) {
    echo "ERROR: Role with ID 7 not found!\n";
    exit(1);
}

echo "Role: {$role->name} (ID: {$role->id})\n";

// Get hrm.manage permission
$permission = Permission::where('slug', 'hrm.manage')->first();

if (!$permission) {
    echo "ERROR: hrm.manage permission not found!\n";
    exit(1);
}

echo "Permission: {$permission->name} (slug: {$permission->slug})\n";

// Check if already assigned
$currentPermissions = $role->permissions()->pluck('permissions.id')->toArray();

if (in_array($permission->id, $currentPermissions)) {
    echo "\nℹ️  Role already has this permission.\n";
    exit(0);
}

// Assign permission
$role->permissions()->attach($permission->id);

echo "\n✅ SUCCESS: hrm.manage permission assigned to Role ID 7!\n";

// Show current count
$newCount = $role->permissions()->count();
echo "Role now has {$newCount} permissions.\n";
