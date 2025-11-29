<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed settings first
        $this->call([
            SettingSeeder::class,
        ]);

        $roles = [
            'super_admin',
            'admin',
            'senior_staff',
            'seller',
            'store_keeper',
            'marketer',
            'retail_customer',
            'wholesale_customer',
        ];

        $phoneBase = 1234567890;

        foreach ($roles as $index => $role) {
            User::create([
                'name' => ucfirst(str_replace('_', ' ', $role)),
                'email' => $role . '@example.com',
                'password' => Hash::make('1234567890'),
                'role' => $role,
                'phone_number' => (string)($phoneBase + $index),
                'whatsapp_number' => null,
                'email_verified_at' => now(),
            ]);
        }
    }
}
