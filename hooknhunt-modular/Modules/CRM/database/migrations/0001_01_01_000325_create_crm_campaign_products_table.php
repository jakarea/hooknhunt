<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create crm_campaign_products pivot table (CRM Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('crm_campaign_products', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('crm_campaign_id')->index(); // References crm_campaigns (CRM module)
            $table->unsignedBigInteger('product_id')->index(); // References products (Catalog module)

            $table->decimal('offer_price', 10, 2);
            $table->decimal('regular_price_at_time', 10, 2)->nullable();
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('crm_campaign_id')->constrained('crm_campaigns')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('product_id')->constrained('products')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_campaign_products');
    }
};
