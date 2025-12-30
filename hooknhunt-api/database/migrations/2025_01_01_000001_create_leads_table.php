<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('phone', 20)->index(); // Searching fast হবে
            $table->string('email')->nullable();
            
            // Lead Tracking
            $table->string('source')->default('manual'); // fb_ads, website, referral
            $table->string('ad_campaign_name')->nullable(); // FB Ad Campaign Name tracking
            $table->string('status')->default('new'); // new, contacted, qualified, lost, converted
            
            // Relationship (Staff who owns this lead)
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            
            // If converted to customer
            $table->foreignId('converted_customer_id')->nullable()->constrained('customers')->onDelete('set null');

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};