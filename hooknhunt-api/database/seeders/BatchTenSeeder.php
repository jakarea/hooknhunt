<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchTenSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Landing Page
        DB::table('landing_pages')->insert([
            'title' => 'Eid Dhamaka Sale 2025',
            'slug' => 'eid-sale',
            'content_sections' => json_encode([
                ['type' => 'hero', 'image' => 'eid-banner.jpg', 'text' => '50% OFF'],
                ['type' => 'product_grid', 'category_id' => 1, 'limit' => 8]
            ]),
            'is_active' => true,
            'created_at' => now(),
        ]);

        // 2. Create Header Menu
        DB::table('menus')->insert([
            'name' => 'Main Header',
            'slug' => 'header_menu',
            'items' => json_encode([
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'Shop', 'url' => '/shop'],
                ['label' => 'Track Order', 'url' => '/track'],
                ['label' => 'Contact', 'url' => '/contact'],
            ]),
            'created_at' => now(),
        ]);

        // 3. Create Support Ticket
        $customer = DB::table('customers')->first();
        if ($customer) {
            $ticketId = DB::table('support_tickets')->insertGetId([
                'ticket_number' => 'TKT-9999',
                'customer_id' => $customer->id,
                'subject' => 'Product arrived damaged',
                'priority' => 'high',
                'status' => 'open',
                'created_at' => now(),
            ]);

            DB::table('ticket_messages')->insert([
                'ticket_id' => $ticketId,
                'user_id' => $customer->user_id, // Assuming linked user
                'message' => 'I received the shirt but it has a hole.',
                'created_at' => now(),
            ]);
        }
    }
}