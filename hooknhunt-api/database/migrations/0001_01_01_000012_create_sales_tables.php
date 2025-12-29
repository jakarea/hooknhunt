<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 29. Customers (Extended Profile for Sales)
        // Users টেবিলে বেসিক ইনফো আছে, এখানে বিজনেসের জন্য এক্সট্রা ডাটা থাকবে।
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->string('name'); // Guest customer দের জন্য নাম লাগতে পারে
            $table->string('phone')->index();
            $table->text('shipping_address')->nullable();
            
            $table->enum('type', ['retail', 'wholesale'])->default('retail');
            $table->decimal('wallet_balance', 10, 2)->default(0); // For refunds/advance
            
            $table->timestamps();
        });

        // 30. Sales Orders (Invoice Header)
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique(); // e.g., INV-1001
            
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('sold_by')->nullable()->constrained('users'); // Salesman ID
            
            $table->enum('channel', ['pos', 'retail_web', 'wholesale_web', 'daraz', 'app']);
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid', 'partial'])->default('unpaid');
            
            // Financials
            $table->decimal('sub_total', 12, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('coupon_code')->nullable();
            $table->decimal('delivery_charge', 8, 2)->default(0);
            $table->decimal('total_amount', 12, 2); // Final Receivable
            $table->decimal('paid_amount', 12, 2)->default(0);
            
            // Profit Tracking (Sum of all items' profit)
            $table->decimal('total_profit', 12, 2)->default(0); // System will calculate this
            
            // External Order Integration
            $table->string('courier_tracking_id')->nullable()->after('status');
            $table->timestamp('shipped_at')->nullable()->after('courier_tracking_id');
            $table->decimal('due_amount', 10, 2)->default(0)->after('total_amount'); // COD Amount

            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 31. Sales Order Items (Invoice Details & Costing)
        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade');
            $table->foreignId('product_variant_id')->constrained('product_variants');
            
            $table->integer('quantity');
            
            // Selling Price
            $table->decimal('unit_price', 10, 2); // Sold at (e.g. 1200)
            $table->decimal('total_price', 12, 2); // 1200 * qty
            
            // Costing (CRITICAL for Profit Report)
            // বিক্রির মুহূর্তে সিস্টেম FIFO লজিক চালিয়ে বের করবে এই আইটেমগুলোর মোট কেনা দাম কত ছিল।
            $table->decimal('total_cost', 12, 2)->default(0); 
            
            $table->timestamps();
        });

        // 32. Sales Item Allocations (FIFO Tracking Log)
        // কোন ব্যাচ থেকে কত পিস মাল মাইনাস হলো তার রেকর্ড।
        Schema::create('sales_item_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_item_id')->constrained('sales_order_items')->onDelete('cascade');
            $table->foreignId('inventory_batch_id')->constrained('inventory_batches');
            
            $table->integer('qty_deducted'); // e.g. 5 pcs from Batch A
            $table->decimal('cost_per_unit', 10, 2); // Cost of Batch A
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_item_allocations');
        Schema::dropIfExists('sales_order_items');
        Schema::dropIfExists('sales_orders');
        Schema::dropIfExists('customers');
    }
};