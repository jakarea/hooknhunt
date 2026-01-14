<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 9. Users (Authentication)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // Role from Batch 1
            $table->foreignId('role_id')->constrained('roles')->onDelete('restrict');
            
            $table->string('name');
            $table->string('phone')->unique(); // Phone login priority
            $table->string('email')->unique()->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // History preservation
        });

        // 10. User Profiles (Extended Info)
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('address')->nullable();
            $table->string('division')->nullable();
            $table->string('district')->nullable();
            $table->string('thana')->nullable();
            $table->date('dob')->nullable(); // For Birthday Marketing
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->foreignId('profile_photo_id')->nullable()->constrained('media_files')->onDelete('set null');
            $table->timestamps();
        });

        


        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('identifier')->index(); // Phone Number
            $table->string('token'); // The OTP Code (e.g. 1234)
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('otps');
    }
};