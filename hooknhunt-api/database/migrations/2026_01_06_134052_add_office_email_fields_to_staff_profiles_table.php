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
        Schema::table('staff_profiles', function (Blueprint $table) {
            // Only add columns if they don't already exist
            if (!Schema::hasColumn('staff_profiles', 'office_email')) {
                $table->string('office_email')->nullable()->after('profile_photo_id');
            }
            if (!Schema::hasColumn('staff_profiles', 'office_email_password')) {
                $table->string('office_email_password')->nullable()->after('office_email');
            }
            if (!Schema::hasColumn('staff_profiles', 'whatsapp_number')) {
                $table->string('whatsapp_number')->nullable()->after('office_email_password');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff_profiles', function (Blueprint $table) {
            $table->dropColumn(['office_email', 'office_email_password', 'whatsapp_number']);
        });
    }
};
