<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 42. Landing Pages (Campaign Builder)
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // e.g., /eid-dhamaka
            
            // Design Data (JSON contains hero section, product grid IDs etc.)
            // React will render components based on this JSON
            $table->json('content_sections')->nullable(); 
            
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 43. Banners & Sliders
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('image_url'); // Link to media_files
            $table->string('redirect_url')->nullable(); // Where to go on click
            
            $table->enum('position', ['home_slider', 'sidebar', 'footer', 'popup']);
            $table->integer('sort_order')->default(0);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 44. Menus (Dynamic Navigation)
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Main Header"
            $table->string('slug')->unique(); // e.g., "header_menu"
            $table->json('items'); // JSON Array: [{label: "Home", url: "/"}, {label: "Shop", url: "/shop"}]
            $table->timestamps();
        });

        // 45. Support Tickets
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique(); // e.g., TKT-1001
            $table->foreignId('customer_id')->constrained('customers');
            $table->string('subject');
            
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['open', 'answered', 'closed'])->default('open');
            
            $table->timestamps();
        });

        // 46. Ticket Messages (Chat History)
        Schema::create('ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users'); // Admin or Customer (Null if system msg)
            
            $table->text('message');
            $table->string('attachment')->nullable();
            
            $table->timestamps();
        });

        // 47. FAQs (Knowledge Base)
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('banners');
        Schema::dropIfExists('landing_pages');
    }
};