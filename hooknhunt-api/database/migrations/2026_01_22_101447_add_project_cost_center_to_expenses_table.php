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
        Schema::table('expenses', function (Blueprint $table) {
            // Project & Cost Center Tracking
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete()->after('account_id')->comment('Linked project');
            $table->foreignId('cost_center_id')->nullable()->constrained('cost_centers')->nullOnDelete()->after('project_id')->comment('Linked cost center');
            $table->foreignId('expense_department_id')->nullable()->constrained('departments')->nullOnDelete()->after('cost_center_id')->comment('Linked department');

            // Indexes for reporting
            $table->index('project_id');
            $table->index('cost_center_id');
            $table->index('expense_department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['cost_center_id']);
            $table->dropForeign(['expense_department_id']);
            $table->dropIndex(['project_id']);
            $table->dropIndex(['cost_center_id']);
            $table->dropIndex(['expense_department_id']);
            $table->dropColumn(['project_id', 'cost_center_id', 'expense_department_id']);
        });
    }
};
