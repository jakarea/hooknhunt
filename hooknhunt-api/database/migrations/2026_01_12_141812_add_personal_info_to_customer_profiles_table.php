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
        Schema::table('customer_profiles', function (Blueprint $table) {
            // Personal Information
            $table->date('dob')->nullable()->after('user_id');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('dob');

            // Address Information (matching staff profile structure)
            $table->text('address')->nullable()->after('gender');
            $table->string('division')->nullable()->after('address');
            $table->string('district')->nullable()->after('division');
            $table->string('thana')->nullable()->after('district');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_profiles', function (Blueprint $table) {
            $table->dropColumn(['dob', 'gender', 'address', 'city', 'district', 'thana']);
        });
    }
};
