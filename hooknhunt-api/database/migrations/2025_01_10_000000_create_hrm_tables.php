<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Departments (New Table)
        if (!Schema::hasTable('departments')) {
            Schema::create('departments', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique(); // e.g., "Sales", "Logistics"
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

       

        // 3. Attendances (New Table)
        if (!Schema::hasTable('attendances')) {
            Schema::create('attendances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->date('date')->index(); 
                
                $table->time('clock_in')->nullable();
                $table->text('break_in')->nullable();
                $table->text('break_out')->nullable();
                $table->time('clock_out')->nullable();
                
                $table->enum('status', ['present', 'late', 'absent', 'leave', 'holiday'])->default('absent');
                $table->text('note')->nullable();
                $table->foreignId('updated_by')->nullable()->constrained('users');
                
                $table->unique(['user_id', 'date']); 
                $table->timestamps();
            });
        }

        // 4. Leaves (New Table)
        if (!Schema::hasTable('leaves')) {
            Schema::create('leaves', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                
                $table->enum('type', ['sick', 'casual', 'unpaid'])->default('casual');
                $table->date('start_date');
                $table->date('end_date');
                $table->integer('days_count')->default(1);
                
                $table->text('reason')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->foreignId('approved_by')->nullable()->constrained('users');
                
                $table->timestamps();
            });
        }
        
        // Note: 'payrolls' table already exists in accounting migration, so we skip it.
    }

    public function down(): void
    {
        Schema::dropIfExists('leaves');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('departments');
    }
};