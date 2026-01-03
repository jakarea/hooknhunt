<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\User;

echo "=== Test Permission Check (Simulating Middleware) ===\n\n";

// Get user with role_id 7
$user = User::with('role')->find(19);

if (!$user) {
    echo "❌ User 19 not found!\n";
    exit(1);
}

echo "Testing permission for:\n";
echo "User: {$user->name} (ID: {$user->id})\n";
echo "Role: {$user->role->name} (slug: {$user->role->slug})\n\n";

// Test the hasPermissionTo method
$permissionSlug = 'hrm.manage';

echo "Checking permission: {$permissionSlug}\n";
echo "Result: " . ($user->hasPermissionTo($permissionSlug) ? "✅ GRANTED" : "❌ DENIED") . "\n\n";

// Debug: Let's see what's happening inside hasPermissionTo
echo "=== Debugging hasPermissionTo() ===\n\n";

// 1. Check if blocked
$isBlocked = $user->directPermissions()
    ->where('slug', $permissionSlug)
    ->where('is_blocked', 1)
    ->exists();

echo "1. Is blocked: " . ($isBlocked ? "YES ❌" : "NO ✅") . "\n";

if (!$isBlocked) {
    // 2. Get role permissions
    echo "2. Getting role permissions...\n";

    // Method A: Using relationship query (like in the model)
    $rolePermissionsA = $user->role?->permissions()->pluck('slug')->toArray() ?? [];
    echo "   Method A (permissions() query): " . count($rolePermissionsA) . " permissions\n";
    echo "   Has hrm.manage: " . (in_array($permissionSlug, $rolePermissionsA) ? "YES ✅" : "NO ❌") . "\n";

    // Method B: Using eager loaded relationship
    $rolePermissionsB = $user->role->permissions->pluck('slug')->toArray();
    echo "   Method B (permissions property): " . count($rolePermissionsB) . " permissions\n";
    echo "   Has hrm.manage: " . (in_array($permissionSlug, $rolePermissionsB) ? "YES ✅" : "NO ❌") . "\n";

    // 3. Get direct permissions (non-blocked)
    $directAllowed = $user->directPermissions()
        ->where('is_blocked', 0)
        ->pluck('slug')->toArray();

    echo "   Direct allowed: " . count($directAllowed) . " permissions\n";

    // 4. Combined check
    $allPermissions = array_merge($rolePermissionsA, $directAllowed);
    echo "\n3. Total permissions combined: " . count($allPermissions) . "\n";
    echo "   Has hrm.manage: " . (in_array($permissionSlug, $allPermissions) ? "YES ✅" : "NO ❌") . "\n";
}

// Show first 10 role permissions
echo "\n=== First 10 Role Permissions ===\n";
$perms = $user->role->permissions()->take(10)->get();
foreach ($perms as $p) {
    $marker = $p->slug === $permissionSlug ? "⭐ " : "   ";
    echo "{$marker}{$p->slug} - {$p->name}\n";
}

echo "\n=== Checking if hrm.manage exists in DB ===\n";
$hrmPerm = \App\Models\Permission::where('slug', $permissionSlug)->first();
if ($hrmPerm) {
    echo "✅ Found: {$hrmPerm->slug} - {$hrmPerm->name} (ID: {$hrmPerm->id})\n";

    $existsInPivot = \DB::table('role_permission')
        ->where('role_id', $user->role_id)
        ->where('permission_id', $hrmPerm->id)
        ->exists();

    echo "Exists in role_permission table: " . ($existsInPivot ? "YES ✅" : "NO ❌") . "\n";
} else {
    echo "❌ NOT FOUND!\n";
}
