<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateEmployeeToStaffPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Updating Employee permissions to Staff permissions...');

        // Mapping of old slugs to new slugs
        $permissionUpdates = [
            'employee.index' => [
                'slug' => 'staff.index',
                'name' => 'View Staff',
                'key' => 'staff_view',
            ],
            'employee.create' => [
                'slug' => 'staff.create',
                'name' => 'Create Staff',
                'key' => 'staff_create',
            ],
            'employee.edit' => [
                'slug' => 'staff.edit',
                'name' => 'Edit Staff',
                'key' => 'staff_edit',
            ],
            'employee.delete' => [
                'slug' => 'staff.delete',
                'name' => 'Delete Staff',
                'key' => 'staff_delete',
            ],
            'employee.view' => [
                'slug' => 'staff.view',
                'name' => 'View Staff Details',
                'key' => 'staff_view',
            ],
        ];

        $updatedCount = 0;

        foreach ($permissionUpdates as $oldSlug => $newData) {
            $permission = \App\Models\Permission::where('slug', $oldSlug)->first();

            if ($permission) {
                $this->command->info("Found permission: {$oldSlug}");

                // Update the permission
                $permission->update([
                    'slug' => $newData['slug'],
                    'name' => $newData['name'],
                    'key' => $newData['key'],
                ]);

                $this->command->info("✓ Updated to: {$newData['slug']}");
                $updatedCount++;
            } else {
                $this->command->warn("✗ Permission not found: {$oldSlug}");
            }
        }

        $this->command->info("Successfully updated {$updatedCount} permission(s).");
    }
}
