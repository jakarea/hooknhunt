<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create permission_user pivot table (User Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('permission_user', function (Blueprint $table) {
            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('user_id')->index(); // References users table (Auth module)
            $table->unsignedBigInteger('permission_id')->index(); // References permissions table (User module)
            $table->integer('is_blocked')->default(0);
            $table->timestamps();

            // Primary key
            $table->primary(['user_id', 'permission_id']);

            // NO foreign keys - module independence
            // $table->foreign('user_id')->constrained()->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('permission_id')->constrained()->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_user');
    }
};
