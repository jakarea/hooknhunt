<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create categories table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('parent_id')->nullable()->index(); // References categories (self-reference)
            $table->unsignedBigInteger('image_id')->nullable()->index(); // References media_files (Media module)

            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('parent_id')->nullable()->constrained('categories')->onDelete('set null'); // ❌ REMOVED
            // $table->foreign('image_id')->nullable()->constrained('media_files')->onDelete('set null'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
