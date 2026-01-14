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
        Schema::table('leaves', function (Blueprint $table) {
            // Change start_date from date to datetime
            $table->dateTime('start_date')->change();
            // Change end_date from date to datetime
            $table->dateTime('end_date')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaves', function (Blueprint $table) {
            // Revert back to date
            $table->date('start_date')->change();
            $table->date('end_date')->change();
        });
    }
};
