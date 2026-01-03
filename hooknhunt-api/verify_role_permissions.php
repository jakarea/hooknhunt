<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

echo "=== Verify Role 7 HRM Access ===\n\n";

// Get role
$role = Role::find(7);

if (!$role) {
    echo "ERROR: Role 7 not found!\n";
    exit(1);
}

echo "Role: {$role->name} (slug: {$role->slug}, ID: {$role->id})\n";

// Get hrm.manage permission
$hrmPermission = Permission::where('slug', 'hrm.manage')->first();

if (!$hrmPermission) {
    echo "ERROR: hrm.manage permission not found!\n";
    echo "Searching for similar permissions...\n";
    $similar = Permission::where('slug', 'LIKE', '%hrm%')->get();
    foreach ($similar as $p) {
        echo "  Found: {$p->slug} - {$p->name}\n";
    }
    exit(1);
}

echo "Permission: {$hrmPermission->name} (ID: {$hrmPermission->id})\n\n";

// Check if role has the permission via pivot table
$hasPermission = DB::table('role_permission')
    ->where('role_id', 7)
    ->where('permission_id', $hrmPermission->id)
    ->exists();

if ($hasPermission) {
    echo "✅ Role 7 HAS hrm.manage in role_permission table\n";
} else {
    echo "❌ Role 7 DOES NOT have hrm.manage in role_permission table\n";
    echo "   Assigning now...\n";

    DB::table('role_permission')->insert([
        'role_id' => 7,
        'permission_id' => $hrmPermission->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "   ✅ Assigned!\n";
}

// Also check via relationship
$viaRelationship = $role->permissions()->where('permissions.id', $hrmPermission->id)->exists();
echo "\nVia relationship check: " . ($viaRelationship ? "✅ YES" : "❌ NO") . "\n";

// Count total permissions
$totalPerms = $role->permissions()->count();
echo "\nTotal permissions for role 7: {$totalPerms}\n";

// Show all HRM-related permissions
echo "\n=== All HRM-related permissions for Role 7 ===\n";
$hrmPermissions = Permission::where('slug', 'LIKE', '%hrm%')
    ->orWhere('slug', 'LIKE', '%employee%')
    ->orWhere('slug', 'LIKE', '%department%')
    ->orWhere('slug', 'LIKE', '%attendance%')
    ->orWhere('slug', 'LIKE', '%payroll%')
    ->get();

echo "HRM-related permissions in database: {$hrmPermissions->count()}\n\n";

$roleHrmPerms = $role->permissions()
    ->whereIn('permissions.id', $hrmPermissions->pluck('id'))
    ->get();

echo "Role 7 has {$roleHrmPerms->count()} HRM-related permissions:\n";
foreach ($roleHrmPerms as $p) {
    echo "  ✓ {$p->slug}\n";
}

// Check cache
echo "\n=== Cache Check ===\n";
if (function_exists('cache')) {
    $cacheKey = "role_{$role->id}_permissions";
    $cached = cache()->get($cacheKey);
    if ($cached) {
        echo "⚠️  Permissions are cached! Key: {$cacheKey}\n";
        echo "   Clearing cache...\n";
        cache()->forget($cacheKey);
        echo "   ✅ Cache cleared\n";
    } else {
        echo "✅ No cached permissions found\n";
    }
}
