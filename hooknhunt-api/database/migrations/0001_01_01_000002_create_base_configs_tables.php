<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 3. Settings (Global Key-Value Store)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index(); // e.g., general, courier, profit_margin
            $table->string('key')->unique(); // e.g., profit_retail_percent
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // 4. Units (Measurement)
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Kilogram
            $table->string('symbol', 10); // e.g., kg
            $table->boolean('allow_decimal')->default(false); // Can sell 1.5 kg?
            $table->timestamps();
        });

        // 5. Warehouses (Inventory Locations)
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., China Warehouse
            $table->string('location')->nullable();
            $table->enum('type', ['china', 'transit', 'local_hub', 'showroom'])->default('local_hub');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('units');
        Schema::dropIfExists('settings');
    }
};