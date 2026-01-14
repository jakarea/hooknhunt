<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 33. Loyalty Rules (পয়েন্ট পাওয়ার নিয়ম)
        Schema::create('loyalty_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Silver Tier Reward"
            $table->string('channel')->default('retail_web');
            $table->decimal('min_order_amount', 10, 2); // 1000 টাকার বেশি কিনলে
            $table->integer('reward_points')->default(1); // X
            $table->decimal('spend_amount', 10, 2)->default(100.00); // Y
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 34. Loyalty Transactions (পয়েন্ট লেজার)
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('sales_order_id')->nullable()->constrained('sales_orders');
            
            $table->enum('type', ['earned', 'redeemed', 'expired', 'adjustment']);
            $table->integer('points'); // পজিটিভ (আর্ন) বা নেগেটিভ (খরচ)
            $table->decimal('equivalent_amount', 10, 2)->default(0); // টাকার অঙ্ক
            
            $table->text('description')->nullable(); // e.g., "Earned from Order #INV-1001"
            $table->timestamps();
        });

        // 35. Affiliates (মার্কেটারদের প্রোফাইল)
        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->string('referral_code')->unique(); // e.g., REF-RAHIM
            $table->decimal('commission_rate', 5, 2)->default(5.00); // 5% Commission
            $table->decimal('total_earned', 12, 2)->default(0);
            $table->decimal('withdrawn_amount', 12, 2)->default(0);
            
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });

        // 36. Affiliate Earnings (কমিশন লগ)
        Schema::create('affiliate_earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained('affiliates');
            $table->foreignId('sales_order_id')->constrained('sales_orders');
            
            $table->decimal('order_amount', 12, 2);
            $table->decimal('commission_amount', 10, 2); // অর্জিত কমিশন
            
            $table->enum('status', ['pending', 'approved', 'paid'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliate_earnings');
        Schema::dropIfExists('affiliates');
        Schema::dropIfExists('loyalty_transactions');
        Schema::dropIfExists('loyalty_rules');
    }
};