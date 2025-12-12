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
        // Enhance attributes table
        Schema::table('attributes', function (Blueprint $table) {
            $table->string('display_name')->nullable()->after('name');
            $table->string('type')->default('select')->after('display_name'); // select, color, image
            $table->boolean('is_required')->default(false)->after('type');
            $table->boolean('is_visible')->default(true)->after('is_required');
            $table->integer('sort_order')->default(0)->after('is_visible');
            $table->timestamps();
        });

        // Enhance attribute_options table
        Schema::table('attribute_options', function (Blueprint $table) {
            $table->string('display_value')->nullable()->after('value');
            $table->string('color_code')->nullable()->after('display_value'); // For color attributes
            $table->string('image_url')->nullable()->after('color_code'); // For image swatches
            $table->integer('sort_order')->default(0)->after('image_url');
            $table->boolean('is_default')->default(false)->after('sort_order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attributes', function (Blueprint $table) {
            $table->dropColumn([
                'display_name',
                'type',
                'is_required',
                'is_visible',
                'sort_order',
                'created_at',
                'updated_at',
            ]);
        });

        Schema::table('attribute_options', function (Blueprint $table) {
            $table->dropColumn([
                'display_value',
                'color_code',
                'image_url',
                'sort_order',
                'is_default',
                'created_at',
                'updated_at',
            ]);
        });
    }
};
