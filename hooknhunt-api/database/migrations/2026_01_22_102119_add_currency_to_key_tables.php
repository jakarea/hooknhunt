<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add currency_id to banks table
        Schema::table('banks', function (Blueprint $table) {
            $table->foreignId('currency_id')->nullable()->after('id')->constrained('currencies')->nullOnDelete();
        });

        // Add currency_id to expenses table
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('currency_id')->nullable()->after('id')->constrained('currencies')->nullOnDelete();
        });

        // Add currency_id to customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('currency_id')->nullable()->after('id')->constrained('currencies')->nullOnDelete();
        });

        // Set existing records to default currency (BDT)
        $defaultCurrency = DB::table('currencies')->where('is_default', true)->first();

        if ($defaultCurrency) {
            DB::table('banks')->whereNull('currency_id')->update(['currency_id' => $defaultCurrency->id]);
            DB::table('expenses')->whereNull('currency_id')->update(['currency_id' => $defaultCurrency->id]);
            DB::table('customers')->whereNull('currency_id')->update(['currency_id' => $defaultCurrency->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banks', function (Blueprint $table) {
            $table->dropForeign(['currency_id']);
            $table->dropColumn('currency_id');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['currency_id']);
            $table->dropColumn('currency_id');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['currency_id']);
            $table->dropColumn('currency_id');
        });
    }
};
