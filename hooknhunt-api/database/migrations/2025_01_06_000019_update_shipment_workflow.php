<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Audit Trail Table (For Edit History)
        Schema::create('shipment_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users'); // কে চেঞ্জ করল
            
            $table->string('field_name'); // e.g., "exchange_rate"
            $table->text('old_value')->nullable(); // e.g., "17.5"
            $table->text('new_value')->nullable(); // e.g., "17.3"
            $table->string('reason')->nullable(); // "Mistake corrected"
            
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_histories');
        // Drop columns logic omitted for brevity
    }
};