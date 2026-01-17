<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class FinancePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder creates all finance-related permissions
     */
    public function run(): void
    {
        $permissions = [
            [
                'group' => 'Finance',
                'modules' => [
                    [
                        'name' => 'Dashboard',
                        'permissions' => [
                            ['label' => 'View Finance Dashboard', 'key' => 'finance_dashboard_view', 'slug' => 'finance.dashboard.index'],
                        ],
                    ],
                    [
                        'name' => 'Accounts',
                        'permissions' => [
                            ['label' => 'View Chart of Accounts', 'key' => 'finance_accounts_view', 'slug' => 'finance.accounts.index'],
                            ['label' => 'Create Account', 'key' => 'finance_accounts_create', 'slug' => 'finance.accounts.create'],
                            ['label' => 'Edit Account', 'key' => 'finance_accounts_edit', 'slug' => 'finance.accounts.edit'],
                            ['label' => 'Delete Account', 'key' => 'finance_accounts_delete', 'slug' => 'finance.accounts.delete'],
                        ],
                    ],
                    [
                        'name' => 'Banks',
                        'permissions' => [
                            ['label' => 'View Bank Accounts', 'key' => 'finance_banks_view', 'slug' => 'finance.banks.index'],
                            ['label' => 'Create Bank Account', 'key' => 'finance_banks_create', 'slug' => 'finance.banks.create'],
                            ['label' => 'Edit Bank Account', 'key' => 'finance_banks_edit', 'slug' => 'finance.banks.edit'],
                            ['label' => 'Delete Bank Account', 'key' => 'finance_banks_delete', 'slug' => 'finance.banks.delete'],
                            ['label' => 'View Bank Transactions', 'key' => 'finance_banks_transactions', 'slug' => 'finance.banks.transactions'],
                            ['label' => 'Deposit Funds', 'key' => 'finance_banks_deposit', 'slug' => 'finance.banks.deposit'],
                            ['label' => 'Withdraw Funds', 'key' => 'finance_banks_withdraw', 'slug' => 'finance.banks.withdraw'],
                            ['label' => 'Transfer Funds', 'key' => 'finance_banks_transfer', 'slug' => 'finance.banks.transfer'],
                        ],
                    ],
                    [
                        'name' => 'Transactions',
                        'permissions' => [
                            ['label' => 'View Transactions', 'key' => 'finance_transactions_view', 'slug' => 'finance.transactions.index'],
                            ['label' => 'Create Transaction', 'key' => 'finance_transactions_create', 'slug' => 'finance.transactions.create'],
                            ['label' => 'Edit Transaction', 'key' => 'finance_transactions_edit', 'slug' => 'finance.transactions.edit'],
                            ['label' => 'Delete Transaction', 'key' => 'finance_transactions_delete', 'slug' => 'finance.transactions.delete'],
                            ['label' => 'Approve Transaction', 'key' => 'finance_transactions_approve', 'slug' => 'finance.transactions.approve'],
                        ],
                    ],
                    [
                        'name' => 'Expenses',
                        'permissions' => [
                            ['label' => 'View Expenses', 'key' => 'finance_expenses_view', 'slug' => 'finance.expenses.index'],
                            ['label' => 'Create Expense', 'key' => 'finance_expenses_create', 'slug' => 'finance.expenses.create'],
                            ['label' => 'Edit Expense', 'key' => 'finance_expenses_edit', 'slug' => 'finance.expenses.edit'],
                            ['label' => 'Delete Expense', 'key' => 'finance_expenses_delete', 'slug' => 'finance.expenses.delete'],
                            ['label' => 'Approve Expense', 'key' => 'finance_expenses_approve', 'slug' => 'finance.expenses.approve'],
                        ],
                    ],
                    [
                        'name' => 'Revenue',
                        'permissions' => [
                            ['label' => 'View Revenue', 'key' => 'finance_revenue_view', 'slug' => 'finance.revenue.index'],
                            ['label' => 'Record Revenue', 'key' => 'finance_revenue_create', 'slug' => 'finance.revenue.create'],
                            ['label' => 'Edit Revenue', 'key' => 'finance_revenue_edit', 'slug' => 'finance.revenue.edit'],
                            ['label' => 'Delete Revenue', 'key' => 'finance_revenue_delete', 'slug' => 'finance.revenue.delete'],
                        ],
                    ],
                    [
                        'name' => 'Reports',
                        'permissions' => [
                            ['label' => 'View Reports', 'key' => 'finance_reports_view', 'slug' => 'finance.reports.index'],
                            ['label' => 'Profit & Loss Report', 'key' => 'finance_reports_profit_loss', 'slug' => 'finance.reports.profit-loss'],
                            ['label' => 'Balance Sheet', 'key' => 'finance_reports_balance_sheet', 'slug' => 'finance.reports.balance-sheet'],
                            ['label' => 'Cash Flow Statement', 'key' => 'finance_reports_cash_flow', 'slug' => 'finance.reports.cash-flow'],
                            ['label' => 'Trial Balance', 'key' => 'finance_reports_trial_balance', 'slug' => 'finance.reports.trial-balance'],
                            ['label' => 'General Ledger', 'key' => 'finance_reports_general_ledger', 'slug' => 'finance.reports.general-ledger'],
                            ['label' => 'Daily Financial Report', 'key' => 'finance_reports_daily', 'slug' => 'finance.reports.daily'],
                            ['label' => 'Export Reports', 'key' => 'finance_reports_export', 'slug' => 'finance.reports.export'],
                        ],
                    ],
                    [
                        'name' => 'Daily Reports',
                        'permissions' => [
                            ['label' => 'View Daily Reports', 'key' => 'finance_daily_reports_view', 'slug' => 'finance.daily-reports.index'],
                            ['label' => 'Generate Daily Report', 'key' => 'finance_daily_reports_generate', 'slug' => 'finance.daily-reports.generate'],
                            ['label' => 'Regenerate Daily Report', 'key' => 'finance_daily_reports_regenerate', 'slug' => 'finance.daily-reports.regenerate'],
                            ['label' => 'Delete Daily Report', 'key' => 'finance_daily_reports_delete', 'slug' => 'finance.daily-reports.delete'],
                        ],
                    ],
                ],
            ],
        ];

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
                            'slug' => $permData['slug'] ?? null,
                            'group_name' => $groupName,
                            'module_name' => $moduleName,
                        ]
                    );
                    $count++;
                }
            }
        }

        $this->command->info("Seeded {$count} Finance permissions.");
    }
}
