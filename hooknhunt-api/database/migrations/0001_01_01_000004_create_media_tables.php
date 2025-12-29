<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 7. Media Folders (Like Google Drive folders)
        Schema::create('media_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->index();
            $table->foreignId('parent_id')->nullable()->constrained('media_folders')->onDelete('cascade');
            $table->timestamps();
        });

        // 8. Media Files
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->nullable()->constrained('media_folders')->onDelete('set null');
            $table->string('filename');
            $table->string('path'); // storage path
            $table->string('url');  // public url
            $table->string('mime_type')->nullable(); // jpg, png, pdf
            $table->unsignedBigInteger('size')->nullable(); // in bytes
            $table->string('original_filename')->nullable()->after('filename');
            $table->string('disk')->default('public')->after('size');
            $table->foreignId('uploaded_by_user_id')->nullable()->constrained('users')->onDelete('set null')->after('disk');
            
            // Extra metadata from your model
            $table->integer('width')->nullable()->after('mime_type');
            $table->integer('height')->nullable()->after('width');
            $table->string('alt_text')->nullable();
            $table->json('variants')->nullable(); // For thumbnails
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
        Schema::dropIfExists('media_folders');
    }
};