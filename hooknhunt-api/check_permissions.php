<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Permission;

// Count total permissions
$total = Permission::count();
echo "Total permissions: $total\n\n";

// Count by group
$groups = Permission::selectRaw('group_name, COUNT(*) as count')
    ->groupBy('group_name')
    ->orderBy('group_name')
    ->get();

echo "=== Permissions by Group ===\n";
foreach ($groups as $group) {
    echo "{$group->group_name}: {$group->count}\n";
}

// Show HRM permissions specifically
echo "\n=== HRM Permissions ===\n";
$hrm = Permission::where('group_name', 'LIKE', '%HRM%')
    ->orWhere('group_name', 'LIKE', '%Employees%')
    ->orWhere('group_name', 'LIKE', '%Departments%')
    ->orWhere('group_name', 'LIKE', '%Attendance%')
    ->orWhere('group_name', 'LIKE', '%Leave%')
    ->orWhere('group_name', 'LIKE', '%Payroll%')
    ->orderBy('group_name')
    ->orderBy('slug')
    ->get();

echo "Found " . $hrm->count() . " HRM-related permissions:\n\n";
foreach ($hrm as $perm) {
    echo "  [{$perm->group_name}] {$perm->slug} - {$perm->name}\n";
}
