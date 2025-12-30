<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Campaign Info
        Schema::create('crm_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // "Winback Offer Dec 2025"
            $table->string('type')->default('pdf_catalog'); // pdf_catalog, sms_blast, email
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('crm_segment_id')->nullable()->constrained('crm_segments'); // Target Audience
            $table->string('status')->default('draft'); // draft, active, completed
            $table->timestamps();
        });

        // 2. Campaign Products (Unique Price for Campaign)
        Schema::create('crm_campaign_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crm_campaign_id')->constrained('crm_campaigns')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            // The Magic Field: Custom Price for this campaign only
            $table->decimal('offer_price', 10, 2); 
            $table->decimal('regular_price_at_time', 10, 2)->nullable(); // For reference/comparison
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_campaign_products');
        Schema::dropIfExists('crm_campaigns');
    }
};