<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // মডিউল অনুযায়ী পারমিশন লিস্ট (Grouped for Admin UI)
        $modules = [
            'User Management' => [
                'user.index'   => 'View User List',
                'user.create'  => 'Create New User',
                'user.edit'    => 'Edit User Details',
                'user.delete'  => 'Delete User',
                'user.ban'     => 'Ban/Deactivate User',
            ],
            'Role & Permissions' => [
                'role.index'   => 'View Roles',
                'role.create'  => 'Create New Role',
                'role.edit'    => 'Edit Role Permissions',
                'role.delete'  => 'Delete Role',
                'user.direct-access' => 'Assign Direct Permissions',
            ],
            'Inventory/Products' => [
                'product.index'  => 'View Products',
                'product.create' => 'Add New Product',
                'product.edit'   => 'Edit Product Info',
                'product.delete' => 'Delete Product',
                'stock.manage'   => 'Manage Stock Levels',
            ],
            'Sales & Orders' => [
                'order.index'   => 'View All Orders',
                'order.create'  => 'Place New Order',
                'order.edit'    => 'Update Order Status',
                'order.delete'  => 'Cancel/Delete Order',
                'invoice.view'  => 'View & Download Invoices',
            ],
            'Accounting' => [
                'account.view'    => 'View Financial Reports',
                'account.expense' => 'Record Expenses',
                'account.income'  => 'Manage Income/Payments',
            ],
            'HRM' => [
                'staff.attendance' => 'Manage Attendance',
                'staff.payroll'    => 'Process Payroll',
                'staff.leave'      => 'Manage Leave Requests',
            ]
        ];

        foreach ($modules as $groupName => $permissions) {
            foreach ($permissions as $slug => $name) {
                Permission::updateOrCreate(
                    ['slug' => $slug], // স্লাগ ইউনিক হিসেবে চেক করবে
                    [
                        'name'       => $name,
                        'group_name' => $groupName,
                    ]
                );
            }
        }
    }
}