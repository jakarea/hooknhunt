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
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();

            // Quotation Number
            $table->string('quotation_number')->unique()->comment('e.g., QT-2024-0001');

            // Link to Opportunity/Customer
            $table->foreignId('opportunity_id')->nullable()->constrained('opportunities')->onDelete('set null');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');

            // Quote Details
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);

            // Dates
            $table->date('valid_until')->comment('Quote valid until this date');
            $table->dateTime('converted_to_order_at')->nullable()->comment('When quote became order');

            // Status
            $table->enum('status', [
                'draft',        // Not yet sent to customer
                'sent',         // Sent to customer
                'accepted',     // Customer accepted
                'rejected',     // Customer rejected
                'expired',      // Valid until date passed
                'converted'     // Converted to order
            ])->default('draft');

            // Notes
            $table->text('customer_notes')->nullable();
            $table->text('terms_conditions')->nullable();

            // Metadata
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();

            // Indexes
            $table->index(['customer_id', 'status']);
            $table->index(['status', 'valid_until']);
            $table->index('quotation_number');
        });

        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('quotation_id')->constrained('quotations')->onDelete('cascade');

            // Product reference (optional, can be custom line item)
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('set null');

            // Item Details
            $table->text('description')->comment('Product name or custom description');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);

            $table->timestamps();

            // Indexes
            $table->index('quotation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
        Schema::dropIfExists('quotations');
    }
};
