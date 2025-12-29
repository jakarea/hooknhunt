<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 6. Chart of Accounts (Double Entry Backbone)
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Cash, Sales Revenue
            $table->string('code')->unique(); // e.g., 1001, 4001
            $table->enum('type', ['asset', 'liability', 'equity', 'income', 'expense']);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};