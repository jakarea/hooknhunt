<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create users table (Auth Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     * This makes the Auth module copy-paste ready.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Reference ID to roles table (User module) - NO foreign key constraint!
            // This allows Auth module to work independently
            $table->unsignedBigInteger('role_id')->nullable()->index();

            $table->string('name');
            $table->string('phone')->unique();
            $table->string('email')->unique()->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // Soft delete - no data loss

            // Indexes for performance
            $table->index(['role_id', 'is_active'], 'users_role_status_index');
            $table->index('created_at', 'users_created_at_index');
            $table->index('name', 'users_name_index');

            // NO foreign key constraint - role_id is reference only
            // This makes Auth module independent from User module
            // $table->foreign('role_id')->constrained('roles'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
