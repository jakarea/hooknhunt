<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create purchase_order_status_history table (Procurement Module)
     *
     * NOTE: NO foreign key constraints!
     * Using reference IDs only for module independence.
     */
    public function up(): void
    {
        Schema::create('purchase_order_status_history', function (Blueprint $table) {
            $table->id();

            // Reference IDs - NO foreign key constraints!
            $table->unsignedBigInteger('purchase_order_id')->index(); // References purchase_orders (Procurement module)
            $table->unsignedBigInteger('changed_by')->nullable()->index(); // References users (Auth module)

            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->index('purchase_order_id');
            $table->index('new_status');
            $table->index('created_at');

            // NO foreign keys - module independence
            // $table->foreign('purchase_order_id')->constrained('purchase_orders')->onDelete('cascade'); // ❌ REMOVED
            // $table->foreign('changed_by')->nullable()->constrained('users')->onDelete('set null'); // ❌ REMOVED
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_status_history');
    }
};
