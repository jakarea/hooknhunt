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
        // Only rename if the employees table exists
        // In fresh migrations, this table doesn't exist, so we skip the rename
        if (Schema::hasTable('employees')) {
            Schema::rename('employees', 'staff');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('staff', 'employees');
    }
};
