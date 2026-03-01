<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create customer_crm_segment pivot table (CRM Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('customer_crm_segment', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('customer_id')->index(); // References customers (CRM or Sales module)
            $table->unsignedBigInteger('crm_segment_id')->index(); // References crm_segments (CRM module)

            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('customer_id')->constrained('customers')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('crm_segment_id')->constrained('crm_segments')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_crm_segment');
    }
};
