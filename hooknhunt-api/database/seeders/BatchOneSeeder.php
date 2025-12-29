<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchOneSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super_admin', 'description' => 'Full Access'],
            ['name' => 'Manager', 'slug' => 'manager', 'description' => 'Store & Staff Manager'],
            ['name' => 'Store Keeper', 'slug' => 'store_keeper', 'description' => 'Inventory Access Only'],
            ['name' => 'Wholesale Customer', 'slug' => 'wholesale_customer', 'description' => 'Bulk Buyer'],
            ['name' => 'Retail Customer', 'slug' => 'retail_customer', 'description' => 'Regular Web User'],
        ];
        DB::table('roles')->insert($roles);

        // 2. Units
        $units = [
            ['name' => 'Piece', 'symbol' => 'pc', 'allow_decimal' => false],
            ['name' => 'Kilogram', 'symbol' => 'kg', 'allow_decimal' => true],
            ['name' => 'Dozen', 'symbol' => 'doz', 'allow_decimal' => false],
            ['name' => 'Liter', 'symbol' => 'ltr', 'allow_decimal' => true],
        ];
        DB::table('units')->insert($units);

        // 3. Warehouses
        $warehouses = [
            ['name' => 'Guangzhou Hub', 'location' => 'China', 'type' => 'china'],
            ['name' => 'In Transit (Sea/Air)', 'location' => 'International Waters', 'type' => 'transit'],
            ['name' => 'Bogura Main Warehouse', 'location' => 'Bogura, BD', 'type' => 'local_hub'],
            ['name' => 'Dhaka Showroom', 'location' => 'Dhaka, BD', 'type' => 'showroom'],
        ];
        DB::table('warehouses')->insert($warehouses);

        // 4. Global Settings (Profit Margins & Delivery)
        $settings = [
            ['group' => 'profit', 'key' => 'margin_wholesale', 'value' => '20'], // 20%
            ['group' => 'profit', 'key' => 'margin_retail', 'value' => '50'],   // 50%
            ['group' => 'profit', 'key' => 'margin_daraz', 'value' => '60'],    // 60%
            ['group' => 'courier', 'key' => 'delivery_charge_dhaka', 'value' => '60'],
            ['group' => 'courier', 'key' => 'delivery_charge_outside', 'value' => '120'],
        ];
        DB::table('settings')->insert($settings);

        // 5. Chart of Accounts (Basic Setup)
        $accounts = [
            // Assets (1000 Series)
            ['name' => 'Cash on Hand', 'code' => '1001', 'type' => 'asset'],
            ['name' => 'Bank Account', 'code' => '1002', 'type' => 'asset'],
            ['name' => 'Inventory Asset', 'code' => '1003', 'type' => 'asset'],
            
            // Liabilities (2000 Series)
            ['name' => 'Accounts Payable', 'code' => '2001', 'type' => 'liability'],
            
            // Income (4000 Series)
            ['name' => 'Sales Revenue', 'code' => '4001', 'type' => 'income'],
            ['name' => 'Shipping Income', 'code' => '4002', 'type' => 'income'],
            
            // Expenses (5000 Series)
            ['name' => 'Cost of Goods Sold (COGS)', 'code' => '5001', 'type' => 'expense'],
            ['name' => 'Office Rent', 'code' => '5002', 'type' => 'expense'],
            ['name' => 'Salary Expense', 'code' => '5003', 'type' => 'expense'],
            ['name' => 'Loss on Damaged Goods', 'code' => '5004', 'type' => 'expense'],
        ];
        DB::table('chart_of_accounts')->insert($accounts);
    }
}