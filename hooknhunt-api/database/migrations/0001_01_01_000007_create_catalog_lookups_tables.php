<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 13. Categories (Nested Tree)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('image_id')->nullable()->constrained('media_files')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 14. Brands
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('logo_id')->nullable()->constrained('media_files')->onDelete('set null');
            $table->string('website')->nullable();
            $table->timestamps();
        });

        // 15. Search Terms (For SEO & Analytics)
        Schema::create('search_terms', function (Blueprint $table) {
            $table->id();
            $table->string('term')->unique(); // e.g. "eid collection"
            $table->unsignedBigInteger('hits')->default(0); // How many times searched
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_terms');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
    }
};