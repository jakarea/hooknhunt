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
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who sent the SMS
            $table->string('request_id')->nullable(); // Alpha SMS request ID
            $table->text('message'); // SMS content
            $table->text('recipients'); // JSON array of phone numbers
            $table->string('sender_id')->nullable(); // Sender ID if used
            $table->string('status')->default('pending'); // pending, sent, failed, delivered
            $table->decimal('charge', 10, 4)->default(0); // Cost of SMS
            $table->timestamp('scheduled_at')->nullable(); // For scheduled SMS
            $table->json('response_data')->nullable(); // Full API response
            $table->json('delivery_report')->nullable(); // Delivery status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};
