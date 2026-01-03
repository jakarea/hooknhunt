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
        // First, drop the foreign key if it exists (to avoid duplicate key error)
        if (Schema::hasTable('cleaning_tasks')) {
            Schema::table('cleaning_tasks', function (Blueprint $table) {
                // Drop existing foreign key if exists
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $foreignKeys = $sm->listTableForeignKeys('cleaning_tasks');

                foreach ($foreignKeys as $foreignKey) {
                    if ($foreignKey->getName() === 'cleaning_tasks_cleaning_plan_id_foreign') {
                        $table->dropForeign('cleaning_tasks_cleaning_plan_id_foreign');
                        echo "Dropped existing foreign key: cleaning_tasks_cleaning_plan_id_foreign\n";
                    }
                }

                // Add the foreign key constraint
                $table->foreign('cleaning_plan_id')
                      ->references('id')
                      ->on('cleaning_plans')
                      ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('cleaning_tasks')) {
            Schema::table('cleaning_tasks', function (Blueprint $table) {
                $table->dropForeign(['cleaning_plan_id']);
            });
        }
    }
};
