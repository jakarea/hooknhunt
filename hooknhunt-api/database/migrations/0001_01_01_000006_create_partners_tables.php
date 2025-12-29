<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 11. Suppliers (China Vendors)
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('shop_name')->nullable(); // 1688 Shop Name
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('wechat_id')->nullable(); // Critical for China
            $table->string('alipay_id')->nullable(); // Critical for Payment
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 12. Couriers (Delivery Partners)
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Pathao, Steadfast, DHL
            $table->enum('type', ['local', 'international']); // Local=BD, Intl=China to BD
            $table->string('api_key')->nullable(); // For integration
            $table->string('secret_key')->nullable();
            $table->string('tracking_url_template')->nullable(); // e.g., https://pathao.com/track/{{ID}}
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('suppliers');
    }
};