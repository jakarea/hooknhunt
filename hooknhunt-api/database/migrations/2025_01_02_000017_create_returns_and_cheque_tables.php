<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ==========================================
        // 1. ADVANCED RETURN MANAGEMENT
        // ==========================================
        
        // Return Requests (Customer initiates this)
        Schema::create('return_requests', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_no')->unique(); // RMA-2025001
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('sales_order_id')->constrained('sales_orders');
            
            // Reasons & Proof
            $table->enum('reason', ['defective', 'wrong_item', 'size_issue', 'change_mind', 'other']);
            $table->text('details')->nullable();
            $table->json('images')->nullable(); // Evidence photos
            
            // Admin Action
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->enum('refund_method', ['wallet', 'bank', 'exchange', 'no_refund'])->default('wallet');
            $table->text('admin_note')->nullable();
            
            $table->timestamps();
        });

        // Return Items (Which items are being returned)
        Schema::create('return_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_request_id')->constrained('return_requests')->onDelete('cascade');
            $table->foreignId('product_variant_id')->constrained('product_variants');
            
            $table->integer('qty');
            $table->enum('condition', ['good', 'damaged'])->default('good'); // Admin will update this upon receive
            
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('return_request_items');
        Schema::dropIfExists('return_requests');
    }
};