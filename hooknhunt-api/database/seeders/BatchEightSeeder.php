<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchEightSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Loyalty Rule
        DB::table('loyalty_rules')->insert([
            'name' => 'Standard Reward',
            'min_order_amount' => 500.00,
            'points_per_100_taka' => 1, // 1% equivalent
            'created_at' => now(),
        ]);

        // 2. Give Points to Customer (Simulating Order Completion)
        $customer = DB::table('customers')->first();
        
        if ($customer) {
            DB::table('loyalty_transactions')->insert([
                'customer_id' => $customer->id,
                'type' => 'earned',
                'points' => 60, // 6000 টাকার কেনাকাটায় ৬০ পয়েন্ট
                'equivalent_amount' => 60.00, // ১ পয়েন্ট = ১ টাকা (যদি হয়)
                'description' => 'Bonus for first purchase',
                'created_at' => now(),
            ]);
        }

        // 3. Create an Affiliate
        $user = DB::table('users')->where('email', 'like', 'user%')->first(); // Any dummy user
        if ($user) {
            DB::table('affiliates')->insert([
                'user_id' => $user->id,
                'referral_code' => 'MONEYMAKER',
                'commission_rate' => 5.00,
                'is_approved' => true,
                'created_at' => now(),
            ]);
        }
    }
}