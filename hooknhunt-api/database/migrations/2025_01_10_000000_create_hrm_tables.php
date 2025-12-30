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

        // 2. Update User Profiles (Add Missing Columns Only)
        if (Schema::hasTable('user_profiles')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                // Check individually to be safe
                if (!Schema::hasColumn('user_profiles', 'department_id')) {
                    $table->foreignId('department_id')->nullable()->after('user_id')->constrained('departments')->onDelete('set null');
                }
                if (!Schema::hasColumn('user_profiles', 'designation')) {
                    $table->string('designation')->nullable()->after('department_id');
                }
                if (!Schema::hasColumn('user_profiles', 'joining_date')) {
                    $table->date('joining_date')->nullable()->after('designation');
                }
                if (!Schema::hasColumn('user_profiles', 'base_salary')) {
                    $table->decimal('base_salary', 10, 2)->default(0)->after('joining_date');
                }
            });
        }

        // 3. Attendances (New Table)
        if (!Schema::hasTable('attendances')) {
            Schema::create('attendances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->date('date')->index(); 
                
                $table->time('clock_in')->nullable();
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
        
        if (Schema::hasTable('user_profiles')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                // Drop columns if they exist
                if (Schema::hasColumn('user_profiles', 'department_id')) {
                    $table->dropForeign(['department_id']);
                    $table->dropColumn('department_id');
                }
                $table->dropColumn(['designation', 'joining_date', 'base_salary']);
            });
        }

        Schema::dropIfExists('departments');
    }
};