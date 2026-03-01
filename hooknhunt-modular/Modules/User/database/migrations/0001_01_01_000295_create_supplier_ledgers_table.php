<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create supplier_ledgers table (User Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('supplier_ledgers', function (Blueprint $table) {
            $table->id();

            // Reference ID - NO foreign key constraint!
            $table->unsignedBigInteger('supplier_id')->index(); // References suppliers table (User module)

            $table->string('type');
            $table->decimal('amount', 15, 2);
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('transaction_id')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();

            // NO foreign key - module independence
            // $table->foreign('supplier_id')->constrained('suppliers')->onDelete('cascade'); // ❌ REMOVED
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_ledgers');
    }
};
