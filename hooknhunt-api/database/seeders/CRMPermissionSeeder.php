<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class CRMPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder creates comprehensive CRM permissions matching frontend routes and backend controllers.
     *
     * Structure matches frontend/src/config/permissions.ts
     * - key: for frontend permission checks (can('crm_leads_view'))
     * - slug: for API permission checks ($user->can('crm.leads.index'))
     */
    public function run(): void
    {
        $permissions = [
            [
                'group' => 'CRM',
                'modules' => [
                    [
                        'name' => 'Dashboard',
                        'permissions' => [
                            ['label' => 'View CRM Dashboard', 'key' => 'crm_dashboard_view', 'slug' => 'crm.dashboard.view'],
                        ],
                    ],
                    [
                        'name' => 'Leads',
                        'permissions' => [
                            ['label' => 'View Leads', 'key' => 'crm_leads_view', 'slug' => 'crm.leads.index'],
                            ['label' => 'Create Lead', 'key' => 'crm_leads_create', 'slug' => 'crm.leads.create'],
                            ['label' => 'Edit Lead', 'key' => 'crm_leads_edit', 'slug' => 'crm.leads.update'],
                            ['label' => 'Delete Lead', 'key' => 'crm_leads_delete', 'slug' => 'crm.leads.delete'],
                            ['label' => 'View Lead Details', 'key' => 'crm_leads_view_details', 'slug' => 'crm.leads.show'],
                            ['label' => 'Assign Lead', 'key' => 'crm_leads_assign', 'slug' => 'crm.leads.assign'],
                            ['label' => 'Convert Lead to Customer', 'key' => 'crm_leads_convert', 'slug' => 'crm.leads.convert'],
                            ['label' => 'Capture Checkout Lead', 'key' => 'crm_leads_capture', 'slug' => 'crm.leads.capture'],
                        ],
                    ],
                    [
                        'name' => 'Activities',
                        'permissions' => [
                            ['label' => 'Log Activity', 'key' => 'crm_activities_create', 'slug' => 'crm.activities.create'],
                            ['label' => 'View Activities', 'key' => 'crm_activities_view', 'slug' => 'crm.activities.index'],
                            ['label' => 'Mark Activity as Done', 'key' => 'crm_activities_complete', 'slug' => 'crm.activities.complete'],
                            ['label' => 'Delete Activity', 'key' => 'crm_activities_delete', 'slug' => 'crm.activities.delete'],
                            ['label' => 'View My Tasks', 'key' => 'crm_activities_my_tasks', 'slug' => 'crm.activities.my_tasks'],
                        ],
                    ],
                    [
                        'name' => 'Customers',
                        'permissions' => [
                            ['label' => 'View Customers', 'key' => 'crm_customers_view', 'slug' => 'crm.customers.index'],
                            ['label' => 'Create Customer', 'key' => 'crm_customers_create', 'slug' => 'crm.customers.create'],
                            ['label' => 'Edit Customer', 'key' => 'crm_customers_edit', 'slug' => 'crm.customers.update'],
                            ['label' => 'Delete Customer', 'key' => 'crm_customers_delete', 'slug' => 'crm.customers.delete'],
                            ['label' => 'View Customer Profile', 'key' => 'crm_customers_view_profile', 'slug' => 'crm.customers.show'],
                            ['label' => 'Manage Customer Addresses', 'key' => 'crm_customers_manage_addresses', 'slug' => 'crm.customers.addresses'],
                        ],
                    ],
                    [
                        'name' => 'Wallet',
                        'permissions' => [
                            ['label' => 'View Wallets', 'key' => 'crm_wallet_view', 'slug' => 'crm.wallet.index'],
                            ['label' => 'View Wallet Details', 'key' => 'crm_wallet_view_details', 'slug' => 'crm.wallet.show'],
                            ['label' => 'View Wallet Transactions', 'key' => 'crm_wallet_transactions', 'slug' => 'crm.wallet.transactions'],
                            ['label' => 'Add Funds to Wallet', 'key' => 'crm_wallet_add_funds', 'slug' => 'crm.wallet.add_funds'],
                            ['label' => 'Deduct Funds from Wallet', 'key' => 'crm_wallet_deduct_funds', 'slug' => 'crm.wallet.deduct_funds'],
                            ['label' => 'Freeze/Unfreeze Wallet', 'key' => 'crm_wallet_freeze', 'slug' => 'crm.wallet.freeze'],
                            ['label' => 'View Wallet Statistics', 'key' => 'crm_wallet_stats', 'slug' => 'crm.wallet.stats'],
                        ],
                    ],
                    [
                        'name' => 'Campaigns',
                        'permissions' => [
                            ['label' => 'View Campaigns', 'key' => 'crm_campaigns_view', 'slug' => 'crm.campaigns.index'],
                            ['label' => 'Create Campaign', 'key' => 'crm_campaigns_create', 'slug' => 'crm.campaigns.create'],
                            ['label' => 'Edit Campaign', 'key' => 'crm_campaigns_edit', 'slug' => 'crm.campaigns.update'],
                            ['label' => 'Delete Campaign', 'key' => 'crm_campaigns_delete', 'slug' => 'crm.campaigns.delete'],
                            ['label' => 'Generate Campaign PDF', 'key' => 'crm_campaigns_generate_pdf', 'slug' => 'crm.campaigns.generate_pdf'],
                            ['label' => 'Run Auto Segmentation', 'key' => 'crm_campaigns_segment', 'slug' => 'crm.campaigns.segment'],
                        ],
                    ],
                    [
                        'name' => 'Affiliates',
                        'permissions' => [
                            ['label' => 'View Affiliates', 'key' => 'crm_affiliates_view', 'slug' => 'crm.affiliates.index'],
                            ['label' => 'Create Affiliate', 'key' => 'crm_affiliates_create', 'slug' => 'crm.affiliates.create'],
                            ['label' => 'Edit Affiliate', 'key' => 'crm_affiliates_edit', 'slug' => 'crm.affiliates.update'],
                            ['label' => 'Delete Affiliate', 'key' => 'crm_affiliates_delete', 'slug' => 'crm.affiliates.delete'],
                            ['label' => 'View Affiliate Stats', 'key' => 'crm_affiliates_stats', 'slug' => 'crm.affiliates.stats'],
                        ],
                    ],
                    [
                        'name' => 'Loyalty',
                        'permissions' => [
                            ['label' => 'View Loyalty Programs', 'key' => 'crm_loyalty_view', 'slug' => 'crm.loyalty.index'],
                            ['label' => 'Create Loyalty Program', 'key' => 'crm_loyalty_create', 'slug' => 'crm.loyalty.create'],
                            ['label' => 'Edit Loyalty Program', 'key' => 'crm_loyalty_edit', 'slug' => 'crm.loyalty.update'],
                            ['label' => 'Delete Loyalty Program', 'key' => 'crm_loyalty_delete', 'slug' => 'crm.loyalty.delete'],
                            ['label' => 'Manage Customer Points', 'key' => 'crm_loyalty_manage_points', 'slug' => 'crm.loyalty.manage_points'],
                        ],
                    ],
                ],
            ],
        ];

        // Insert permissions
        $count = 0;
        foreach ($permissions as $groupData) {
            $groupName = $groupData['group'];

            foreach ($groupData['modules'] as $moduleData) {
                $moduleName = $moduleData['name'];

                foreach ($moduleData['permissions'] as $permData) {
                    Permission::updateOrCreate(
                        ['slug' => $permData['slug']],
                        [
                            'name' => $permData['label'],
                            'key' => $permData['key'] ?? null,
                            'group_name' => $groupName,
                            'module_name' => $moduleName,
                        ]
                    );
                    $count++;
                }
            }
        }

        $this->command->info("Seeded {$count} CRM permissions.");

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign CRM permissions to standard roles based on their access level
     */
    private function assignPermissionsToRoles(): void
    {
        // Create CRM-specific roles if they don't exist
        $crmRoles = [
            ['slug' => 'sales_manager', 'name' => 'Sales Manager'],
            ['slug' => 'sales_executive', 'name' => 'Sales Executive'],
            ['slug' => 'sales_agent', 'name' => 'Sales Agent'],
            ['slug' => 'telecaller', 'name' => 'Telecaller'],
            ['slug' => 'sales_support', 'name' => 'Sales Support'],
        ];

        foreach ($crmRoles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                [
                    'name' => $roleData['name'],
                    'description' => 'CRM role for ' . $roleData['name'],
                ]
            );
        }

        // Get all CRM permissions
        $crmPermissions = Permission::where('group_name', 'CRM')->pluck('id');

        // Standard CRM roles and their permission assignments
        $rolePermissions = [
            'super_admin' => $crmPermissions, // Full access
            'admin' => $crmPermissions, // Full CRM access

            'sales_manager' => [
                // Dashboard
                'crm.dashboard.view',
                // Leads - full management
                'crm.leads.index', 'crm.leads.create', 'crm.leads.update', 'crm.leads.show',
                'crm.leads.assign', 'crm.leads.convert', 'crm.leads.capture',
                // Activities - full management
                'crm.activities.create', 'crm.activities.index', 'crm.activities.complete', 'crm.activities.my_tasks',
                // Customers - full view and edit
                'crm.customers.index', 'crm.customers.show', 'crm.customers.create', 'crm.customers.update',
                'crm.customers.addresses',
                // Wallet - view and manage
                'crm.wallet.index', 'crm.wallet.show', 'crm.wallet.transactions',
                'crm.wallet.add_funds', 'crm.wallet.deduct_funds',
                // Campaigns - full management
                'crm.campaigns.index', 'crm.campaigns.create', 'crm.campaigns.update',
                'crm.campaigns.generate_pdf', 'crm.campaigns.segment',
                // Affiliates - full management
                'crm.affiliates.index', 'crm.affiliates.create', 'crm.affiliates.update',
                'crm.affiliates.stats',
                // Loyalty - view and manage
                'crm.loyalty.index', 'crm.loyalty.manage_points',
            ],

            'sales_executive' => [
                // Dashboard
                'crm.dashboard.view',
                // Leads - create, view own assigned, edit
                'crm.leads.index', 'crm.leads.create', 'crm.leads.update', 'crm.leads.show',
                'crm.leads.convert',
                // Activities - create, view own
                'crm.activities.create', 'crm.activities.my_tasks', 'crm.activities.complete',
                // Customers - view, create
                'crm.customers.index', 'crm.customers.show', 'crm.customers.create',
                'crm.customers.addresses',
                // Wallet - view
                'crm.wallet.index', 'crm.wallet.show', 'crm.wallet.transactions',
                // Campaigns - view only
                'crm.campaigns.index',
            ],

            'sales_agent' => [
                // Dashboard
                'crm.dashboard.view',
                // Leads - create and view
                'crm.leads.index', 'crm.leads.create', 'crm.leads.show',
                // Activities - create and view own
                'crm.activities.create', 'crm.activities.my_tasks', 'crm.activities.complete',
                // Customers - view
                'crm.customers.index', 'crm.customers.show',
                // Wallet - view
                'crm.wallet.index', 'crm.wallet.transactions',
            ],

            'telecaller' => [
                // Dashboard
                'crm.dashboard.view',
                // Leads - create and view
                'crm.leads.index', 'crm.leads.create', 'crm.leads.show',
                // Activities - create and view own
                'crm.activities.create', 'crm.activities.my_tasks', 'crm.activities.complete',
                // Customers - view only
                'crm.customers.index', 'crm.customers.show',
            ],

            'sales_support' => [
                // Dashboard
                'crm.dashboard.view',
                // Leads - view only
                'crm.leads.index', 'crm.leads.show',
                // Customers - view and manage
                'crm.customers.index', 'crm.customers.show', 'crm.customers.addresses',
                // Wallet - view
                'crm.wallet.index', 'crm.wallet.show', 'crm.wallet.transactions',
            ],
        ];

        $assignedCount = 0;
        foreach ($rolePermissions as $roleSlug => $permissionSlugs) {
            $role = Role::where('slug', $roleSlug)->first();

            if (!$role) {
                $this->command->warn("Role '{$roleSlug}' not found. Skipping permissions assignment.");
                continue;
            }

            // Check if $permissionSlugs is a Collection (IDs) or array (slugs)
            // Collections from pluck('id') contain IDs, string arrays contain slugs
            if ($permissionSlugs instanceof \Illuminate\Support\Collection) {
                // Already a Collection of IDs
                $permissionIds = $permissionSlugs;
            } else {
                // Array of slugs, need to convert to IDs
                $permissionIds = Permission::whereIn('slug', $permissionSlugs)->pluck('id');
            }

            if ($permissionIds->isNotEmpty()) {
                // Sync permissions (removes old permissions, adds new ones)
                $role->permissions()->sync($permissionIds);
                $assignedCount++;
                $this->command->info("Assigned {$permissionIds->count()} CRM permissions to role '{$roleSlug}'.");
            }
        }

        $this->command->info("Completed assigning CRM permissions to {$assignedCount} roles.");
    }
}
