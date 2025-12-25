<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin users
        $adminUsers = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'super_admin',
                'phone_number' => '01711111111',
                'whatsapp_number' => '01711111111',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Dhanmondi, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'admin',
                'phone_number' => '01711111112',
                'whatsapp_number' => '01711111112',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Gulshan, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Senior Staff',
                'email' => 'senior@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'manager',
                'phone_number' => '01711111113',
                'whatsapp_number' => '01711111113',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Banani, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Store Keeper',
                'email' => 'store@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'store_keeper',
                'phone_number' => '01711111114',
                'whatsapp_number' => '01711111114',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Mirpur, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Marketing Manager',
                'email' => 'marketing@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'marketer',
                'phone_number' => '01711111115',
                'whatsapp_number' => '01711111115',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Uttara, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
        ];

        // Staff users (sellers)
        $staffUsers = [
            [
                'name' => 'Seller One',
                'email' => 'seller1@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'seller',
                'phone_number' => '01711111116',
                'whatsapp_number' => '01711111116',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Mohammadpur, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Seller Two',
                'email' => 'seller2@hooknhunt.com',
                'password' => Hash::make('1234567890'),
                'role' => 'seller',
                'phone_number' => '01711111117',
                'whatsapp_number' => '01711111117',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Khilgaon, Dhaka',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
        ];

        // Customer users
        $customerUsers = [
            [
                'name' => 'Rahim Ahmed',
                'email' => 'rahim@gmail.com',
                'password' => Hash::make('1234567890'),
                'role' => 'retail_customer',
                'phone_number' => '01811111111',
                'whatsapp_number' => '01811111111',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'House 12, Road 5, Dhanmondi',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Karim Rahman',
                'email' => 'karim@gmail.com',
                'password' => Hash::make('1234567890'),
                'role' => 'retail_customer',
                'phone_number' => '01811111112',
                'whatsapp_number' => '01811111112',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Flat 3A, Block B, Gulshan',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Abdul Wholesaler',
                'email' => 'abdul@wholesale.com',
                'password' => Hash::make('1234567890'),
                'role' => 'wholesale_customer',
                'phone_number' => '01811111113',
                'whatsapp_number' => '01811111113',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Market Area, Mirpur',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Mohammad Shopkeeper',
                'email' => 'mohammad@shop.com',
                'password' => Hash::make('1234567890'),
                'role' => 'wholesale_customer',
                'phone_number' => '01811111114',
                'whatsapp_number' => '01811111114',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Shop 12, New Market',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
            [
                'name' => 'Fahim Customer',
                'email' => 'fahim@gmail.com',
                'password' => Hash::make('1234567890'),
                'role' => 'retail_customer',
                'phone_number' => '01811111115',
                'whatsapp_number' => '01811111115',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'address' => 'Uttara Sector 7',
                'city' => 'Dhaka',
                'district' => 'Dhaka',
            ],
        ];

        // Combine all users
        $allUsers = array_merge($adminUsers, $staffUsers, $customerUsers);

        // Insert users with firstOrCreate to avoid duplicates
        foreach ($allUsers as $userData) {
            User::firstOrCreate(
                ['phone_number' => $userData['phone_number']],
                $userData
            );
        }
    }
}