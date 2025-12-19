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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();

            // File information
            $table->string('filename');
            $table->string('original_filename');
            $table->string('mime_type');
            $table->string('extension', 10);
            $table->unsignedBigInteger('size_bytes');

            // Image-specific fields (nullable for non-images)
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();

            // Storage and organization
            $table->string('disk', 20)->default('public'); // 'public', 's3', etc.
            $table->string('path'); // storage path relative to disk root
            $table->string('url'); // public URL
            $table->json('variants')->nullable(); // thumbnail, medium, large, etc.

            // Metadata
            $table->string('hash', 64)->unique(); // SHA-256 hash for deduplication
            $table->foreignId('folder_id')->nullable()->constrained('media_folders')->onDelete('set null');
            $table->foreignId('uploaded_by_user_id')->constrained('users')->onDelete('cascade');

            // Usage tracking
            $table->unsignedInteger('usage_count')->default(0);
            $table->json('usage_models')->nullable(); // tracks which models use this file

            $table->timestamps();

            // Indexes
            $table->index(['folder_id', 'created_at']);
            $table->index(['mime_type', 'created_at']);
            $table->index(['uploaded_by_user_id', 'created_at']);
            $table->index('hash');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
