<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Segments Definition Table
        Schema::create('crm_segments', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // VIP, Inactive, Wholesale
            $table->text('description')->nullable();
            $table->boolean('is_auto')->default(false); // System generated or Manual?
            $table->timestamps();
        });

        // 2. Pivot Table (Customer <-> Segment)
        Schema::create('customer_crm_segment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('crm_segment_id')->constrained('crm_segments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_crm_segment');
        Schema::dropIfExists('crm_segments');
    }
};