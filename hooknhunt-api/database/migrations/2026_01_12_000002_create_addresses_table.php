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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();

            // Link to user (customer)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Address Details
            $table->string('label')->default('Home')->comment('Home, Office, etc.');
            $table->string('full_name');
            $table->string('phone');
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('area')->comment('Thana/upazila');
            $table->string('city')->comment('District');
            $table->string('postal_code')->nullable();

            // Location
            $table->string('division')->nullable();
            $table->string('country')->default('Bangladesh');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Flags
            $table->boolean('is_default')->default(false)->comment('Primary address');
            $table->boolean('is_billing_address')->default(false);
            $table->boolean('is_shipping_address')->default(true);

            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'is_default']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
