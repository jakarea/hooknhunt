<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create otps table (Auth Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();

            // Reference ID to users table (Auth module) - NO foreign key constraint!
            $table->unsignedBigInteger('user_id')->nullable()->index();

            $table->string('identifier')->index();
            $table->string('token');
            $table->timestamp('expires_at');
            $table->timestamps();

            // NO foreign key constraint - user_id is reference only
            // $table->foreign('user_id')->constrained('users')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
