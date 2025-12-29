<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 19. Product Channel Settings (Price Overrides)
        // ডিফল্ট প্রাইস ভ্যারিয়েন্ট টেবিলে আছে, কিন্তু স্পেসিফিক চ্যানেলের জন্য এখানে থাকবে।
        Schema::create('product_channel_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade');
            
            $table->enum('channel', ['retail_web', 'wholesale_web', 'daraz', 'pos']);
            
            // Channel Specific Overrides
            $table->string('custom_name')->nullable(); // দারাজে হয়তো অন্য নাম দিবেন
             $table->string('channel_slug')->nullable(); // 
            $table->decimal('price', 10, 2); // The selling price for this channel
            $table->boolean('is_active')->default(true); // দারাজে এই ভ্যারিয়েন্ট অফ রাখতে পারেন
            
            // Unique constraint: A variant can have only one setting per channel
            $table->unique(['product_variant_id', 'channel']);
            $table->timestamps();
        });

        // 20. Courier Zone Rates (Dynamic Delivery Charge)
        Schema::create('courier_zone_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('courier_id')->constrained('couriers')->onDelete('cascade');
            
            $table->string('zone_name'); // e.g., "Inside Dhaka", "Outside Dhaka"
            $table->decimal('base_charge', 8, 2); // e.g., 60 Taka
            $table->decimal('base_weight_kg', 8, 2)->default(1); // e.g., up to 1 KG
            $table->decimal('extra_charge_per_kg', 8, 2)->default(0); // e.g., 20 Taka
            
            $table->timestamps();
        });

        // 21. Discounts / Coupons
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g., EID2025
            $table->enum('type', ['percentage', 'fixed_amount']);
            $table->decimal('amount', 10, 2); // 10% or 100 Taka
            
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('max_uses')->nullable(); // Total usage limit
            $table->integer('used_count')->default(0);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discounts');
        Schema::dropIfExists('courier_zone_rates');
        Schema::dropIfExists('product_channel_settings');
    }
};