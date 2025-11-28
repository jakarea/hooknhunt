<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert default exchange rate
        Setting::updateOrCreate(
            ['key' => 'exchange_rate_rmb_bdt'],
            ['value' => '17.50']
        );
    }
}
