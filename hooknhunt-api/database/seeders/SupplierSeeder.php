<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Guangzhou Fishing Gear Co.',
                'shop_name' => 'Guangzhou Fishing Equipment',
                'email' => 'sales@gzfishgear.com',
                'shop_url' => 'https://www.gzfishgear.com',
                'wechat_id' => 'gzfishgear2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'gzfishgear@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Wang. Phone: +86-20-88887777. Specializes in fishing rods and reels.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shanghai Marine Supply Ltd.',
                'shop_name' => 'Shanghai Marine Supplies',
                'email' => 'info@shmarine.com',
                'shop_url' => 'https://www.shmarine.com',
                'wechat_id' => 'shmarine2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'shmarine@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Ms. Li. Phone: +86-21-66665555. Specializes in fishing lines and accessories.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Yiwu Fishing Tackle Factory',
                'shop_name' => 'Yiwu Fishing Tackle',
                'email' => 'export@ywfishing.com',
                'shop_url' => 'https://www.ywfishing.com',
                'wechat_id' => 'ywfishing2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'ywfishing@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Chen. Phone: +86-579-55554444. Wholesale fishing tackle and accessories.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Beijing Outdoor Sports Co.',
                'shop_name' => 'Beijing Outdoor Sports',
                'email' => 'beijing@outdoorsports.cn',
                'shop_url' => 'https://www.outdoorsports.cn',
                'wechat_id' => 'beijingoutdoor2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'beijingoutdoor@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Zhang. Phone: +86-10-44443333. High-quality outdoor fishing equipment.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shenzhen Fishing Technology',
                'shop_name' => 'Shenzhen Fishing Tech',
                'email' => 'sales@szfishingtech.com',
                'shop_url' => 'https://www.szfishingtech.com',
                'wechat_id' => 'szfishingtech2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'szfishingtech@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Ms. Liu. Phone: +86-755-33332222. Modern fishing electronics and tech gear.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ningbo Fishing Equipment Factory',
                'shop_name' => 'Ningbo Fishing Equipment',
                'email' => 'export@nbfishery.com',
                'shop_url' => 'https://www.nbfishery.com',
                'wechat_id' => 'nbfishery2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'nbfishery@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Wu. Phone: +86-574-22221111. Bulk fishing equipment manufacturer.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hangzhou Tackle Manufacturing',
                'shop_name' => 'Hangzhou Tackle Mfg.',
                'email' => 'hangzhou@tacklemfg.com',
                'shop_url' => 'https://www.hztacklemfg.com',
                'wechat_id' => 'hangzhoutackle2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'hangzhoutackle@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Huang. Phone: +86-571-11110000. Premium fishing tackle manufacturer.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Qingdao Marine Supplies',
                'shop_name' => 'Qingdao Marine Store',
                'email' => 'qingdao@marinesupply.cn',
                'shop_url' => 'https://www.qdmarinesupply.cn',
                'wechat_id' => 'qingdaomarine2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'qingdaomarine@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Zhao. Phone: +86-532-99998888. Marine and saltwater fishing equipment.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tianjin Fishing World',
                'shop_name' => 'Tianjin Fishing World',
                'email' => 'tianjin@fishingworld.com',
                'shop_url' => 'https://www.tjfishingworld.com',
                'wechat_id' => 'tianjinfishing2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'tianjinfishing@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Yang. Phone: +86-22-88887777. Comprehensive fishing equipment supplier.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wuhan Sports Equipment Co.',
                'shop_name' => 'Wuhan Sports Equipment',
                'email' => 'wuhan@sportsequipment.cn',
                'shop_url' => 'https://www.wuhansports.cn',
                'wechat_id' => 'wuhansports2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'wuhansports@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Zhou. Phone: +86-27-77776666. Sports fishing and recreational equipment.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Chongqing Fishing Accessories',
                'shop_name' => 'Chongqing Fishing Store',
                'email' => 'chongqing@fishingacc.com',
                'shop_url' => 'https://www.cqfishingacc.com',
                'wechat_id' => 'chongqingfishing2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'chongqingfishing@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Ms. Xu. Phone: +86-23-66665555. Fishing accessories and small equipment.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Xiamen Fishing Import Export',
                'shop_name' => 'Xiamen Fishing Trade',
                'email' => 'xiamen@fishingtrade.com',
                'shop_url' => 'https://www.xmfishingtrade.com',
                'wechat_id' => 'xiamenfishing2024',
                'wechat_qr_url' => 'https://via.placeholder.com/200x200/07C160/FFFFFF?text=WeChat+QR',
                'alipay_id' => 'xiamenfishing@alipay.com',
                'alipay_qr_url' => 'https://via.placeholder.com/200x200/1677FF/FFFFFF?text=Alipay+QR',
                'contact_info' => 'Contact: Mr. Lin. Phone: +86-592-55554444. Import export fishing equipment specialist.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert suppliers without duplicates
        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['email' => $supplier['email']],
                $supplier
            );
        }
    }
}