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
        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();

            // Link to users table
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');

            // Marketing Info
            $table->string('source')->default('website')->comment('website, instagram, referral, facebook, etc');
            $table->string('medium')->nullable()->comment('Specific campaign/source');
            $table->string('referral_code')->nullable()->comment('If referred by affiliate');

            // Preferences
            $table->string('preferred_language', 10)->default('en');
            $table->string('preferred_currency', 3)->default('BDT');
            $table->boolean('marketing_consent')->default(false)->comment('Email/SMS consent');
            $table->boolean('do_not_contact')->default(false)->comment('Opt-out from marketing');

            // Customer Type
            $table->enum('type', ['retail', 'wholesale'])->default('retail');
            $table->string('trade_license_no')->nullable()->comment('For wholesale customers');
            $table->string('tax_id')->nullable()->comment('For B2B customers');

            // Loyalty Tier
            $table->enum('loyalty_tier', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->unsignedInteger('loyalty_points')->default(0);
            $table->decimal('lifetime_value', 12, 2)->default(0)->comment('Total spent ever');

            // Stats (cached for performance)
            $table->unsignedInteger('total_orders')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->decimal('avg_order_value', 10, 2)->default(0);
            $table->dateTime('last_order_date')->nullable();

            // Metadata
            $table->text('notes')->nullable()->comment('Sales notes about this customer');
            $table->json('tags')->nullable()->comment('Custom tags: ["VIP", "repeat-buyer"]');

            $table->timestamps();

            // Indexes for performance
            $table->index('type');
            $table->index('loyalty_tier');
            $table->index('source');
            $table->index('total_spent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_profiles');
    }
};
