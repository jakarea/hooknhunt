<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_activities', function (Blueprint $table) {
            $table->id();
            
            // কে কাজটা করেছে (Staff)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // কার সাথে কথা হয়েছে (Lead OR Customer)
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('cascade');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('cascade');

            // Activity Details
            $table->string('type', 50); // call, meeting, email, note, whatsapp
            $table->string('summary'); // "Called regarding Eid Offer"
            $table->text('description')->nullable(); // Detailed feedback
            
            // Follow-up Scheduler
            $table->dateTime('schedule_at')->nullable(); // Next reminder time
            $table->boolean('is_done')->default(false); // Task completed?

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_activities');
    }
};