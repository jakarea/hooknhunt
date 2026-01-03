<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Permission;

echo "=== Module Management Permissions ===\n\n";

$modulePerms = Permission::where('group_name', 'Module Management')
    ->orderBy('slug')
    ->get();

echo "Found {$modulePerms->count()} module management permissions:\n\n";

foreach ($modulePerms as $perm) {
    echo "  ✓ {$perm->slug} - {$perm->name}\n";
}

echo "\n=== Checking Role 7 Permissions ===\n\n";

use App\Models\Role;

$role = Role::find(7);

if ($role) {
    echo "Role: {$role->name} (ID: {$role->id})\n";

    $hrmManagePerm = Permission::where('slug', 'hrm.manage')->first();

    if ($hrmManagePerm) {
        $hasPermission = $role->permissions()->where('permissions.id', $hrmManagePerm->id)->exists();

        if ($hasPermission) {
            echo "  ✅ Has hrm.manage permission\n";
        } else {
            echo "  ❌ Missing hrm.manage permission\n";
        }
    }

    // Show which module management permissions role 7 has
    echo "\nModule Management permissions:\n";
    $modulePermIds = $modulePerms->pluck('id')->toArray();
    $roleModulePerms = $role->permissions()
        ->whereIn('permissions.id', $modulePermIds)
        ->get();

    foreach ($roleModulePerms as $perm) {
        echo "  ✓ {$perm->slug}\n";
    }

    $missing = array_diff($modulePermIds, $roleModulePerms->pluck('id')->toArray());
    if (count($missing) > 0) {
        echo "\nMissing permissions:\n";
        foreach ($missing as $id) {
            $perm = $modulePerms->firstWhere('id', $id);
            echo "  ❌ {$perm->slug}\n";
        }
    }
}
