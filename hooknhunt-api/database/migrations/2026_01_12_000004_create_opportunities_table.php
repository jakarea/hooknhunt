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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();

            // Link to Lead/Customer
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('set null');
            $table->foreignId('customer_id')->nullable()->constrained('users')->onDelete('set null');

            // Deal Info
            $table->string('title')->comment('Deal name/title');
            $table->text('description')->nullable()->comment('Deal description');
            $table->decimal('value', 12, 2)->default(0)->comment('Expected deal value');
            $table->string('currency', 3)->default('BDT');
            $table->unsignedTinyInteger('probability')->default(50)->comment('0-100%');
            $table->date('expected_close_date')->nullable();

            // Pipeline Stage
            $table->enum('stage', [
                'qualification',
                'proposal',
                'negotiation',
                'closed_won',
                'closed_lost'
            ])->default('qualification');
            $table->unsignedInteger('stage_order')->default(1)->comment('For Kanban ordering');

            // Metadata
            $table->string('source')->nullable()->comment('Where did this deal come from');
            $table->string('lost_reason')->nullable()->comment('If closed_lost');

            // Assignment
            $table->foreignId('assigned_to')->nullable()->comment('Assigned staff member')->constrained('users')->onDelete('set null');
            $table->foreignId('created_by')->nullable()->comment('Created by staff member')->constrained('users')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('stage');
            $table->index(['customer_id', 'stage']);
            $table->index(['assigned_to', 'stage']);
            $table->index('value');
            $table->index('expected_close_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
