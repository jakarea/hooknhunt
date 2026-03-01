<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create user_profiles table (User Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('user_id')->nullable()->index(); // References users table (Auth module)
            $table->unsignedBigInteger('profile_photo_id')->nullable()->index(); // References media_files (Media module)

            $table->text('address')->nullable();
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->string('thana')->nullable();
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('user_id')->constrained('users')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('profile_photo_id')->constrained('media_files')->onDelete('set null'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
