<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create leads table (CRM Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 20)->index();
            $table->string('email')->nullable();
            $table->string('source')->default('manual');
            $table->string('ad_campaign_name')->nullable();
            $table->string('status')->default('new');

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('assigned_to')->nullable()->index(); // References users (Auth module)
            $table->unsignedBigInteger('converted_customer_id')->nullable()->index(); // References customers (CRM or Sales module)

            $table->text('notes')->nullable();
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // ❌ REMOVED
            // $table->foreign('converted_customer_id')->nullable()->constrained('customers')->onDelete('set null'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
