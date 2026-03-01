<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create media_files table (Media Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('folder_id')->nullable()->index(); // References media_folders (Media module)
            $table->string('filename');
            $table->string('original_filename')->nullable();
            $table->string('path');
            $table->string('url');
            $table->string('mime_type')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('disk')->default('public');
            $table->unsignedBigInteger('uploaded_by_user_id')->nullable()->index(); // References users (Auth module)
            $table->string('alt_text')->nullable();
            $table->json('variants')->nullable();
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('folder_id')->nullable()->constrained('media_folders')->onDelete('set null'); // ❌ REMOVED
            // $table->foreign('uploaded_by_user_id')->nullable()->constrained('users'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
