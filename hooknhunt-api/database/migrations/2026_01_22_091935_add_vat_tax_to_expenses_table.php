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
        Schema::table('expenses', function (Blueprint $table) {
            // VAT (Value Added Tax) fields - nullable as they're optional
            $table->decimal('vat_percentage', 5, 2)->nullable()->after('amount')->comment('VAT percentage (e.g., 15.00 for 15%)');
            $table->decimal('vat_amount', 15, 2)->nullable()->after('vat_percentage')->comment('Calculated VAT amount');
            $table->string('vat_challan_no')->nullable()->after('vat_amount')->comment('VAT challan number for tax authority');

            // Tax (AIT - Advance Income Tax) fields - nullable as they're optional
            $table->decimal('tax_percentage', 5, 2)->nullable()->after('vat_challan_no')->comment('Tax/AIT percentage (e.g., 3.00 for 3%)');
            $table->decimal('tax_amount', 15, 2)->nullable()->after('tax_percentage')->comment('Calculated tax amount');
            $table->string('tax_challan_no')->nullable()->after('tax_amount')->comment('Tax challan number for tax authority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn([
                'vat_percentage',
                'vat_amount',
                'vat_challan_no',
                'tax_percentage',
                'tax_amount',
                'tax_challan_no',
            ]);
        });
    }
};
