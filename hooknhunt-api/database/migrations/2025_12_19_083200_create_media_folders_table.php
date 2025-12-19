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
        Schema::create('media_folders', function (Blueprint $table) {
            $table->id();

            // Folder information
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Hierarchy
            $table->foreignId('parent_id')->nullable()->constrained('media_folders')->onDelete('cascade');
            $table->unsignedInteger('sort_order')->default(0);

            // Visibility and access
            $table->boolean('is_public')->default(true);
            $table->json('allowed_roles')->nullable(); // ['admin', 'store_keeper']

            $table->timestamps();

            // Indexes
            $table->index(['parent_id', 'sort_order']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_folders');
    }
};
