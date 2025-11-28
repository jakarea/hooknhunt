<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Display all settings as key-value pairs.
     */
    public function index()
    {
        $settings = Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Update multiple settings.
     */
    public function update(Request $request)
    {
        $data = $request->all();

        // Handle simple key-value format: {"exchange_rate_rmb_bdt": "18.00"}
        foreach ($data as $key => $value) {
            if (is_string($key) && (is_string($value) || is_numeric($value))) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => (string) $value]
                );
            }
        }

        $updatedSettings = Setting::pluck('value', 'key');
        return response()->json($updatedSettings);
    }
}
