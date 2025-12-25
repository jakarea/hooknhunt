<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'supervisor' to the role enum field (including existing 'senior_staff')
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'manager', 'supervisor', 'seller', 'store_keeper', 'marketer', 'retail_customer', 'wholesale_customer') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'supervisor' from the role enum field (keeping existing 'senior_staff')
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'manager', 'seller', 'store_keeper', 'marketer', 'retail_customer', 'wholesale_customer') NOT NULL");
    }
};
