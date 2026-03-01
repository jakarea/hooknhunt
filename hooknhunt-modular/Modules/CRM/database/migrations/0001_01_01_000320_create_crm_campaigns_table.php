<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create crm_campaigns table (CRM Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('crm_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('pdf_catalog');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('crm_segment_id')->nullable()->index(); // References crm_segments (CRM module)

            $table->string('status')->default('draft');
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('crm_segment_id')->nullable()->constrained('crm_segments'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_campaigns');
    }
};
