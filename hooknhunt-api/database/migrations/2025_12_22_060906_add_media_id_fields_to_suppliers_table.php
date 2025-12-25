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
        Schema::table('suppliers', function (Blueprint $table) {
            $table->unsignedBigInteger('wechat_qr_media_id')->nullable()->after('wechat_qr_url');
            $table->unsignedBigInteger('alipay_qr_media_id')->nullable()->after('alipay_qr_url');

            $table->foreign('wechat_qr_media_id')->references('id')->on('media_files')->onDelete('set null');
            $table->foreign('alipay_qr_media_id')->references('id')->on('media_files')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['wechat_qr_media_id']);
            $table->dropForeign(['alipay_qr_media_id']);
            $table->dropColumn(['wechat_qr_media_id', 'alipay_qr_media_id']);
        });
    }
};
