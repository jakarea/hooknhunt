<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create crm_activities table (CRM Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('crm_activities', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('user_id')->index(); // References users (Auth module)
            $table->unsignedBigInteger('lead_id')->nullable()->index(); // References leads (CRM module)
            $table->unsignedBigInteger('customer_id')->nullable()->index(); // References customers (CRM or Sales module)

            $table->string('type', 50);
            $table->string('summary');
            $table->text('description')->nullable();
            $table->dateTime('schedule_at')->nullable();
            $table->boolean('is_done')->default(false);
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('user_id')->constrained('users')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('lead_id')->nullable()->constrained('leads')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('customer_id')->nullable()->constrained('customers')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_activities');
    }
};
