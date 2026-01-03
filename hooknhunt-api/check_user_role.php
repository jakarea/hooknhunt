<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

echo "=== Check Users with Role ID 7 ===\n\n";

$users = User::where('role_id', 7)->get();

if ($users->isEmpty()) {
    echo "❌ No users found with role_id 7\n";

    echo "\n=== All Users and Their Roles ===\n";
    $allUsers = User::select('id', 'name', 'phone', 'role_id')->get();
    foreach ($allUsers as $u) {
        $role = Role::find($u->role_id);
        $roleName = $role ? $role->name : 'No Role';
        echo "User ID: {$u->id}, Name: {$u->name}, Phone: {$u->phone}, Role: {$roleName} (ID: {$u->role_id})\n";
    }
} else {
    echo "Found {$users->count()} user(s) with role_id 7:\n\n";

    foreach ($users as $user) {
        $role = $user->role; // Get role via relationship
        echo "User ID: {$user->id}\n";
        echo "Name: {$user->name}\n";
        echo "Phone: {$user->phone}\n";
        echo "Role: {$role->name} (ID: {$user->role_id})\n";
        echo "Role Slug: {$role->slug}\n";

        // Check if user has hrm.manage via role
        $hasPermission = $user->role->permissions()->where('slug', 'hrm.manage')->exists();
        echo "Has hrm.manage: " . ($hasPermission ? "✅ YES" : "❌ NO") . "\n";
        echo "\n";
    }
}

echo "\n=== Check Direct Permissions on Role ===\n";
$role = Role::find(7);
echo "Role: {$role->name}\n";
echo "Total Permissions: {$role->permissions()->count()}\n";

$hrmPerm = $role->permissions()->where('slug', 'hrm.manage')->first();
if ($hrmPerm) {
    echo "✅ hrm.manage permission exists on role\n";
} else {
    echo "❌ hrm.manage permission NOT found on role\n";
}
