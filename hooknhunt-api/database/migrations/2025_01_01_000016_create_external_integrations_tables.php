<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Marketplaces Config (For Daraz, Evaly API Keys)
        // ভবিষ্যতে এখান থেকেই টোকেন ম্যানেজ হবে।
        Schema::create('marketplaces', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Daraz, Evaly
            $table->string('slug')->unique(); // e.g., daraz_bd
            
            // API Credentials
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            
            // Settings
            $table->string('webhook_url')->nullable(); // Where marketplace sends updates
            $table->boolean('is_active')->default(false);
            $table->boolean('sync_stock')->default(true); // Auto update stock?
            $table->boolean('sync_price')->default(true); // Auto update price?
            
            $table->timestamps();
        });

        // 2. Webhook Logs (For Debugging Future Sync Issues)
        // দারাজ থেকে কোনো ডাটা আসলে এখানে র হিসেবে সেভ থাকবে।
        Schema::create('webhook_logs', function (Blueprint $table) {
            $table->id();
            $table->string('source'); // e.g., daraz
            $table->string('event'); // e.g., order_created, product_updated
            $table->json('payload'); // Full JSON Data
            $table->integer('status_code')->default(200);
            $table->text('response_body')->nullable(); // আমাদের সিস্টেম কি রিপ্লাই দিয়েছে
            $table->timestamps();
        });

        // 3. Dropshipper Configs (Extend User functionality)
        // ড্রপশিপারদের নিজস্ব দোকানের নাম বা লোগো থাকতে পারে।
        Schema::create('dropshipper_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->string('store_name')->nullable();
            $table->string('store_url')->nullable();
            $table->string('logo_url')->nullable();
            
            // Profit Settings
            $table->decimal('default_profit_margin', 5, 2)->default(0); // e.g., 10% auto markup
            
            // API Access
            $table->string('api_key')->unique()->nullable(); // তাদের ওয়েবসাইটে আমাদের প্রোডাক্ট দেখাতে লাগবে
            $table->boolean('auto_sync_products')->default(false);
            
            $table->timestamps();
        });

        // 4. Update Sales Orders Table (Add External Columns)
        // দারাজ বা ইভ্যালির অর্ডার আইডি রাখার জায়গা।
        Schema::table('sales_orders', function (Blueprint $table) {
            // যদি আগে না থাকে, তবেই অ্যাড হবে
            if (!Schema::hasColumn('sales_orders', 'external_order_id')) {
                $table->string('external_order_id')->nullable()->after('invoice_no')->index(); // e.g., DARAZ-556677
                $table->string('external_source')->nullable()->after('external_order_id'); // e.g., daraz
                $table->json('external_data')->nullable()->after('external_source'); // Raw meta data from marketplace
            }
        });
    }

    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropColumn(['external_order_id', 'external_source', 'external_data']);
        });
        Schema::dropIfExists('dropshipper_configs');
        Schema::dropIfExists('webhook_logs');
        Schema::dropIfExists('marketplaces');
    }
};