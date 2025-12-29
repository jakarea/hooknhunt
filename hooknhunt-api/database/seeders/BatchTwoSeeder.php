<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BatchTwoSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch Role IDs
        $superAdminRole = DB::table('roles')->where('slug', 'super_admin')->value('id');
        $wholesaleRole = DB::table('roles')->where('slug', 'wholesale_customer')->value('id');
        $retailRole = DB::table('roles')->where('slug', 'retail_customer')->value('id');

        // 1. Create Super Admin (YOU)
        $adminId = DB::table('users')->insertGetId([
            'role_id' => $superAdminRole,
            'name' => 'Owner Admin',
            'phone' => '01700000000',
            'email' => 'admin@system.com',
            'password' => Hash::make('password'), // Change later
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('user_profiles')->insert([
            'user_id' => $adminId,
            'address' => 'Bogura HQ',
            'city' => 'Bogura',
            'created_at' => now(),
        ]);

        // 2. Create Dummy Customers
        for ($i = 1; $i <= 5; $i++) {
            $uId = DB::table('users')->insertGetId([
                'role_id' => $retailRole,
                'name' => 'Retail Customer ' . $i,
                'phone' => '0190000000' . $i,
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
             DB::table('user_profiles')->insert(['user_id' => $uId, 'city' => 'Dhaka']);
        }

        // 3. Suppliers (China)
        $suppliers = [
            [
                'name' => 'Guangzhou Textile Factory',
                'shop_name' => 'Fashion Best 1688',
                'wechat_id' => 'wxid_88292',
                'alipay_id' => 'user1@alipay.com',
                'created_at' => now()
            ],
            [
                'name' => 'Shenzhen Electronics Ltd',
                'shop_name' => 'TechGadget 1688',
                'wechat_id' => 'wxid_99201',
                'alipay_id' => 'user2@alipay.com',
                'created_at' => now()
            ]
        ];
        DB::table('suppliers')->insert($suppliers);

        // 4. Couriers
        $couriers = [
            ['name' => 'Pathao', 'type' => 'local', 'tracking_url_template' => 'https://pathao.com/track/'],
            ['name' => 'Steadfast', 'type' => 'local', 'tracking_url_template' => 'https://steadfast.com.bd/t/'],
            ['name' => 'Sundarban', 'type' => 'local', 'tracking_url_template' => NULL],
            ['name' => 'SkyNet Cargo', 'type' => 'international', 'tracking_url_template' => NULL],
        ];
        DB::table('couriers')->insert($couriers);
    }
}