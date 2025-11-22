<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('shop_name')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('shop_url')->nullable();
            $table->string('wechat_id')->nullable();
            $table->string('wechat_qr_url')->nullable();
            $table->string('alipay_id')->nullable();
            $table->string('alipay_qr_url')->nullable();
            $table->text('contact_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};