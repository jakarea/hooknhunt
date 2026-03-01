<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create brands table (Catalog Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('logo_id')->nullable()->index(); // References media_files (Media module)

            $table->string('website')->nullable();
            $table->timestamps();

            // NO foreign keys - module independence
            // $table->foreign('logo_id')->nullable()->constrained('media_files')->onDelete('set null'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
