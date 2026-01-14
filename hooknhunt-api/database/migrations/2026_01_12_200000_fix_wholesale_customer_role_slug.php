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
        // Fix the typo in the wholesale customer role slug
        DB::table('roles')
            ->where('slug', 'wholesell_customer')
            ->update([
                'slug' => 'wholesale_customer',
                'name' => 'Wholesale Customer' // Also fix the name if it had the typo
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to the typo
        DB::table('roles')
            ->where('slug', 'wholesale_customer')
            ->update([
                'slug' => 'wholesell_customer',
                'name' => 'Wholesell Customer'
            ]);
    }
};
