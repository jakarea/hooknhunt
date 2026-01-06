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
        Schema::table('permissions', function (Blueprint $table) {
            // Add key field for frontend permission checks (can('key'))
            $table->string('key')->nullable()->after('slug');

            // Add module_name field to group permissions by module
            $table->string('module_name')->nullable()->after('group_name');

            // Add indexes for better query performance
            $table->index('key');
            $table->index(['group_name', 'module_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropIndex(['group_name', 'module_name']);
            $table->dropIndex(['key']);
            $table->dropColumn(['key', 'module_name']);
        });
    }
};
