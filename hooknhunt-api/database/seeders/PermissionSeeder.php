<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            // Dashboard & Analytics
            'Dashboard' => [
                'dashboard.view' => 'View Dashboard',
                'dashboard.analytics' => 'View Analytics',
            ],

            // Products & Catalog
            'Products' => [
                'product.index' => 'View Products',
                'product.create' => 'Create Product',
                'product.edit' => 'Edit Product',
                'product.delete' => 'Delete Product',
                'product.import' => 'Import Products',
                'product.export' => 'Export Products',
            ],
            'Product Variants' => [
                'variant.index' => 'View Variants',
                'variant.create' => 'Create Variant',
                'variant.edit' => 'Edit Variant',
                'variant.delete' => 'Delete Variant',
            ],
            'Categories' => [
                'category.index' => 'View Categories',
                'category.create' => 'Create Category',
                'category.edit' => 'Edit Category',
                'category.delete' => 'Delete Category',
            ],
            'Brands' => [
                'brand.index' => 'View Brands',
                'brand.create' => 'Create Brand',
                'brand.edit' => 'Edit Brand',
                'brand.delete' => 'Delete Brand',
            ],
            'Attributes' => [
                'attribute.index' => 'View Attributes',
                'attribute.create' => 'Create Attribute',
                'attribute.edit' => 'Edit Attribute',
                'attribute.delete' => 'Delete Attribute',
            ],
            'Units' => [
                'unit.index' => 'View Units',
                'unit.create' => 'Create Unit',
                'unit.edit' => 'Edit Unit',
                'unit.delete' => 'Delete Unit',
            ],
            'Print Labels' => [
                'label.print' => 'Print Labels',
            ],

            // Procurement
            'Purchase Orders' => [
                'purchase_order.index' => 'View Purchase Orders',
                'purchase_order.create' => 'Create Purchase Order',
                'purchase_order.edit' => 'Edit Purchase Order',
                'purchase_order.delete' => 'Delete Purchase Order',
                'purchase_order.approve' => 'Approve Purchase Order',
                'purchase_order.receive' => 'Receive Purchase Order',
            ],
            'Suppliers' => [
                'supplier.index' => 'View Suppliers',
                'supplier.create' => 'Create Supplier',
                'supplier.edit' => 'Edit Supplier',
                'supplier.delete' => 'Delete Supplier',
            ],
            'Purchase Returns' => [
                'purchase_return.index' => 'View Purchase Returns',
                'purchase_return.create' => 'Create Purchase Return',
                'purchase_return.edit' => 'Edit Purchase Return',
                'purchase_return.delete' => 'Delete Purchase Return',
            ],

            // Shipments
            'Shipments' => [
                'shipment.index' => 'View Shipments',
                'shipment.create' => 'Create Shipment',
                'shipment.edit' => 'Edit Shipment',
                'shipment.delete' => 'Delete Shipment',
                'shipment.view' => 'View Shipment Details',
                'shipment.costing' => 'View Shipment Costing',
                'shipment.receive' => 'Receive Shipment Stock',
            ],

            // Inventory
            'Stock Management' => [
                'stock.index' => 'View Current Stock',
                'stock.adjust' => 'Adjust Stock',
                'stock.transfer' => 'Transfer Stock',
            ],
            'Stock History' => [
                'stock_history.index' => 'View Stock History',
                'stock_history.export' => 'Export Stock History',
            ],
            'Warehouses' => [
                'warehouse.index' => 'View Warehouses',
                'warehouse.create' => 'Create Warehouse',
                'warehouse.edit' => 'Edit Warehouse',
                'warehouse.delete' => 'Delete Warehouse',
            ],
            'Stock Transfers' => [
                'transfer.index' => 'View Transfers',
                'transfer.create' => 'Create Transfer',
                'transfer.approve' => 'Approve Transfer',
            ],
            'Stock Adjustments' => [
                'adjustment.index' => 'View Adjustments',
                'adjustment.create' => 'Create Adjustment',
                'adjustment.approve' => 'Approve Adjustment',
            ],
            'Stock Take' => [
                'stock_take.index' => 'View Stock Takes',
                'stock_take.create' => 'Create Stock Take',
                'stock_take.approve' => 'Approve Stock Take',
            ],
            'Unsorted Stock' => [
                'unsorted_stock.index' => 'View Unsorted Stock',
                'unsorted_stock.process' => 'Process Unsorted Stock',
            ],

            // Sales
            'Sales Orders' => [
                'order.index' => 'View Orders',
                'order.create' => 'Create Order',
                'order.edit' => 'Edit Order',
                'order.delete' => 'Delete Order',
                'order.view' => 'View Order Details',
                'order.cancel' => 'Cancel Order',
                'order.refund' => 'Process Refund',
            ],
            'Sales Returns' => [
                'sales_return.index' => 'View Sales Returns',
                'sales_return.create' => 'Create Sales Return',
                'sales_return.approve' => 'Approve Sales Return',
            ],
            'Quotations' => [
                'quotation.index' => 'View Quotations',
                'quotation.create' => 'Create Quotation',
                'quotation.edit' => 'Edit Quotation',
                'quotation.convert' => 'Convert to Order',
                'quotation.delete' => 'Delete Quotation',
            ],

            // POS
            'POS Terminal' => [
                'pos.access' => 'Access POS Terminal',
                'pos.sell' => 'Make Sale',
                'pos.hold' => 'Hold Order',
                'pos.resume' => 'Resume Held Order',
            ],
            'POS Management' => [
                'pos_history.index' => 'View POS History',
                'pos_register.view' => 'View POS Register',
                'pos_register.close' => 'Close POS Register',
                'held_orders.index' => 'View Held Orders',
                'held_orders.delete' => 'Delete Held Order',
            ],

            // Logistics
            'Courier Booking' => [
                'booking.index' => 'View Bookings',
                'booking.create' => 'Create Booking',
                'booking.edit' => 'Edit Booking',
                'booking.cancel' => 'Cancel Booking',
            ],
            'Tracking' => [
                'tracking.view' => 'View Tracking',
                'tracking.update' => 'Update Tracking Status',
            ],
            'Couriers' => [
                'courier.index' => 'View Couriers',
                'courier.create' => 'Create Courier',
                'courier.edit' => 'Edit Courier',
                'courier.delete' => 'Delete Courier',
            ],
            'Zones' => [
                'zone.index' => 'View Zones',
                'zone.create' => 'Create Zone',
                'zone.edit' => 'Edit Zone',
                'zone.delete' => 'Delete Zone',
            ],

            // CRM
            'Customers' => [
                'customer.index' => 'View Customers',
                'customer.create' => 'Create Customer',
                'customer.edit' => 'Edit Customer',
                'customer.delete' => 'Delete Customer',
                'customer.view' => 'View Customer Details',
                'customer.export' => 'Export Customers',
            ],
            'Leads' => [
                'lead.index' => 'View Leads',
                'lead.create' => 'Create Lead',
                'lead.edit' => 'Edit Lead',
                'lead.convert' => 'Convert to Customer',
                'lead.delete' => 'Delete Lead',
            ],
            'Wallet' => [
                'wallet.view' => 'View Wallet',
                'wallet.add' => 'Add Funds',
                'wallet.deduct' => 'Deduct Funds',
            ],
            'Loyalty' => [
                'loyalty.view' => 'View Loyalty Programs',
                'loyalty.manage' => 'Manage Loyalty Points',
                'loyalty_rules.index' => 'View Loyalty Rules',
                'loyalty_rules.create' => 'Create Loyalty Rule',
                'loyalty_rules.edit' => 'Edit Loyalty Rule',
            ],

            // Marketing
            'Campaigns' => [
                'campaign.index' => 'View Campaigns',
                'campaign.create' => 'Create Campaign',
                'campaign.edit' => 'Edit Campaign',
                'campaign.delete' => 'Delete Campaign',
                'campaign.send' => 'Send Campaign',
            ],
            'Affiliates' => [
                'affiliate.index' => 'View Affiliates',
                'affiliate.create' => 'Create Affiliate',
                'affiliate.edit' => 'Edit Affiliate',
                'affiliate.delete' => 'Delete Affiliate',
            ],

            // HRM
            'Employees' => [
                'employee.index' => 'View Employees',
                'employee.create' => 'Create Employee',
                'employee.edit' => 'Edit Employee',
                'employee.delete' => 'Delete Employee',
                'employee.view' => 'View Employee Details',
            ],
            'Departments' => [
                'department.index' => 'View Departments',
                'department.create' => 'Create Department',
                'department.edit' => 'Edit Department',
                'department.delete' => 'Delete Department',
            ],
            'Attendance' => [
                'attendance.index' => 'View Attendance',
                'attendance.create' => 'Mark Attendance',
                'attendance.edit' => 'Edit Attendance',
                'attendance.approve' => 'Approve Attendance',
            ],
            'Leave Management' => [
                'leave.index' => 'View Leave Requests',
                'leave.create' => 'Request Leave',
                'leave.approve' => 'Approve Leave',
                'leave.reject' => 'Reject Leave',
                'leave.cancel' => 'Cancel Leave',
            ],
            'Payroll' => [
                'payroll.index' => 'View Payroll',
                'payroll.create' => 'Generate Payroll',
                'payroll.edit' => 'Edit Payroll',
                'payroll.process' => 'Process Payment',
                'payroll.approve' => 'Approve Payroll',
            ],

            // Finance
            'Transactions' => [
                'transaction.index' => 'View Transactions',
                'transaction.create' => 'Create Transaction',
                'transaction.edit' => 'Edit Transaction',
                'transaction.delete' => 'Delete Transaction',
            ],
            'Expenses' => [
                'expense.index' => 'View Expenses',
                'expense.create' => 'Create Expense',
                'expense.edit' => 'Edit Expense',
                'expense.delete' => 'Delete Expense',
                'expense.approve' => 'Approve Expense',
            ],
            'Accounts' => [
                'account.index' => 'View Accounts',
                'account.create' => 'Create Account',
                'account.edit' => 'Edit Account',
            ],
            'Financial Reports' => [
                'report.profit_loss' => 'View Profit & Loss',
                'report.balance_sheet' => 'View Balance Sheet',
                'report.cash_flow' => 'View Cash Flow',
            ],

            // Support
            'Support Tickets' => [
                'ticket.index' => 'View Tickets',
                'ticket.create' => 'Create Ticket',
                'ticket.edit' => 'Edit Ticket',
                'ticket.delete' => 'Delete Ticket',
                'ticket.close' => 'Close Ticket',
                'ticket.assign' => 'Assign Ticket',
            ],
            'Support Categories' => [
                'support_category.index' => 'View Support Categories',
                'support_category.create' => 'Create Support Category',
                'support_category.edit' => 'Edit Support Category',
                'support_category.delete' => 'Delete Support Category',
            ],

            // CMS
            'Banners' => [
                'banner.index' => 'View Banners',
                'banner.create' => 'Create Banner',
                'banner.edit' => 'Edit Banner',
                'banner.delete' => 'Delete Banner',
            ],
            'Menus' => [
                'menu.index' => 'View Menus',
                'menu.create' => 'Create Menu',
                'menu.edit' => 'Edit Menu',
                'menu.delete' => 'Delete Menu',
            ],
            'Pages' => [
                'page.index' => 'View Pages',
                'page.create' => 'Create Page',
                'page.edit' => 'Edit Page',
                'page.delete' => 'Delete Page',
                'page.publish' => 'Publish Page',
            ],
            'Blog' => [
                'blog.index' => 'View Blog Posts',
                'blog.create' => 'Create Blog Post',
                'blog.edit' => 'Edit Blog Post',
                'blog.delete' => 'Delete Blog Post',
                'blog.publish' => 'Publish Blog Post',
            ],
            'Media' => [
                'media.index' => 'View Media Library',
                'media.upload' => 'Upload Media',
                'media.delete' => 'Delete Media',
                'media.organize' => 'Organize Media',
            ],

            // Reports
            'Sales Reports' => [
                'report.sales.index' => 'View Sales Report',
                'report.sales.export' => 'Export Sales Report',
            ],
            'Stock Reports' => [
                'report.stock.index' => 'View Stock Report',
                'report.stock.export' => 'Export Stock Report',
            ],
            'Product Reports' => [
                'report.product.index' => 'View Product Report',
                'report.product.export' => 'Export Product Report',
            ],
            'Customer Reports' => [
                'report.customer.index' => 'View Customer Report',
                'report.customer.export' => 'Export Customer Report',
            ],
            'Tax Reports' => [
                'report.tax.index' => 'View Tax Report',
                'report.tax.export' => 'Export Tax Report',
            ],

            // User & Access Management
            'Users' => [
                'user.index' => 'View Users',
                'user.create' => 'Create User',
                'user.edit' => 'Edit User',
                'user.delete' => 'Delete User',
                'user.ban' => 'Ban/Deactivate User',
                'user.impersonate' => 'Impersonate User',
            ],
            'Roles' => [
                'role.index' => 'View Roles',
                'role.create' => 'Create Role',
                'role.edit' => 'Edit Role',
                'role.delete' => 'Delete Role',
                'role.assign' => 'Assign Role to User',
            ],
            'Permissions' => [
                'permission.index' => 'View Permissions',
                'permission.assign' => 'Assign Permissions',
            ],
            'Direct Permissions' => [
                'direct_permission.grant' => 'Grant Direct Permission',
                'direct_permission.revoke' => 'Revoke Direct Permission',
                'direct_permission.block' => 'Block Permission',
            ],

            // Settings
            'General Settings' => [
                'settings.general.view' => 'View General Settings',
                'settings.general.edit' => 'Edit General Settings',
            ],
            'Payment Settings' => [
                'settings.payment.view' => 'View Payment Settings',
                'settings.payment.edit' => 'Edit Payment Settings',
            ],
            'Tax Settings' => [
                'settings.tax.view' => 'View Tax Settings',
                'settings.tax.edit' => 'Edit Tax Settings',
            ],
            'API Settings' => [
                'settings.api.view' => 'View API Settings',
                'settings.api.edit' => 'Edit API Settings',
                'settings.api.keys' => 'Manage API Keys',
            ],
            'Backup' => [
                'backup.create' => 'Create Backup',
                'backup.download' => 'Download Backup',
                'backup.restore' => 'Restore Backup',
            ],
            'Audit Logs' => [
                'audit_log.index' => 'View Audit Logs',
                'audit_log.export' => 'Export Audit Logs',
            ],

            // System
            'System' => [
                'system.manage' => 'System Management',
                'notification.view' => 'View Notifications',
                'notification.send' => 'Send Notifications',
            ],

            // Module Management (High-level access for entire modules)
            'Module Management' => [
                'product.manage' => 'Product Catalog Management',
                'inventory.manage' => 'Inventory Management',
                'sales.manage' => 'Sales Management',
                'shipment.manage' => 'Shipment & Logistics Management',
                'supplier.manage' => 'Supplier Management',
                'hrm.manage' => 'HRM & Payroll Management',
                'crm.manage' => 'CRM & Customer Management',
                'account.manage' => 'Accounting & Finance Management',
                'support.manage' => 'Support & Ticket Management',
                'media.manage' => 'Media Library Management',
            ],
        ];

        foreach ($modules as $groupName => $permissions) {
            foreach ($permissions as $slug => $name) {
                Permission::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $name,
                        'group_name' => $groupName,
                    ]
                );
            }
        }

        $this->command->info('Seeded ' . count($modules, COUNT_RECURSIVE) . ' permissions across ' . count($modules) . ' modules.');
    }
}
