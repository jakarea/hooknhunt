<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = [
            [
                'order_number' => 'ORD-2025-001',
                'user_id' => 10, // Rahim Ahmed (retail customer)
                'customer_name' => 'Rahim Ahmed',
                'customer_phone' => '01811111111',
                'customer_email' => 'rahim@gmail.com',
                'shipping_address' => 'House 12, Road 5, Dhanmondi, Dhaka-1205',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'delivered',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 530.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 595.00,
                'payable_amount' => 595.00,
                'notes' => 'Please call before delivery.',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(12),
            ],
            [
                'order_number' => 'ORD-2025-002',
                'user_id' => 11, // Karim Rahman (retail customer)
                'customer_name' => 'Karim Rahman',
                'customer_phone' => '01811111112',
                'customer_email' => 'karim@gmail.com',
                'shipping_address' => 'Flat 3A, Block B, Gulshan-1, Dhaka-1212',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'confirmed',
                'payment_method' => 'mobile',
                'payment_details' => 'bKash payment completed',
                'subtotal' => 1250.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 50.00,
                'total_amount' => 1265.00,
                'payable_amount' => 1265.00,
                'notes' => 'Office delivery, deliver between 10am-5pm.',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(6),
            ],
            [
                'order_number' => 'ORD-2025-003',
                'user_id' => 12, // Abdul Wholesaler (wholesale customer)
                'customer_name' => 'Abdul Wholesaler',
                'customer_phone' => '01811111113',
                'customer_email' => 'abdul@wholesale.com',
                'shipping_address' => 'Market Area, Shop 12, Mirpur-1, Dhaka-1216',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'processing',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 3200.00,
                'delivery_charge' => 0.00, // Free for wholesale
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 3205.00,
                'payable_amount' => 3205.00,
                'notes' => 'Wholesale order - delivery to market shop.',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(3),
            ],
            [
                'order_number' => 'ORD-2025-004',
                'user_id' => 13, // Mohammad Shopkeeper (wholesale customer)
                'customer_name' => 'Mohammad Shopkeeper',
                'customer_phone' => '01811111114',
                'customer_email' => 'mohammad@shop.com',
                'shipping_address' => 'New Market, Shop 45, Dhaka-1205',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'shipped',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 2100.00,
                'delivery_charge' => 0.00, // Free for wholesale
                'service_charge' => 5.00,
                'coupon_discount' => 100.00,
                'total_amount' => 2005.00,
                'payable_amount' => 2005.00,
                'notes' => 'Wholesale order with discount.',
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(10),
            ],
            [
                'order_number' => 'ORD-2025-005',
                'user_id' => 14, // Fahim Customer (retail customer)
                'customer_name' => 'Fahim Customer',
                'customer_phone' => '01811111115',
                'customer_email' => 'fahim@gmail.com',
                'shipping_address' => 'Uttara Sector 7, House 15, Road 2, Dhaka-1230',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'pending',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 380.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 445.00,
                'payable_amount' => 445.00,
                'notes' => 'Apartment building - confirm before delivery.',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'order_number' => 'ORD-2025-006',
                'user_id' => 10, // Rahim Ahmed (retail customer) - Repeat customer
                'customer_name' => 'Rahim Ahmed',
                'customer_phone' => '01811111111',
                'customer_email' => 'rahim@gmail.com',
                'shipping_address' => 'House 12, Road 5, Dhanmondi, Dhaka-1205',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'confirmed',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 150.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 215.00,
                'payable_amount' => 215.00,
                'notes' => 'Additional fishing line and hooks.',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'order_number' => 'ORD-2025-007',
                'user_id' => 11, // Karim Rahman (retail customer) - Repeat customer
                'customer_name' => 'Karim Rahman',
                'customer_phone' => '01811111112',
                'customer_email' => 'karim@gmail.com',
                'shipping_address' => 'Flat 3A, Block B, Gulshan-1, Dhaka-1212',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'processing',
                'payment_method' => 'card',
                'payment_details' => 'Visa card payment - transaction ID: TXN123456789',
                'subtotal' => 750.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 25.00,
                'total_amount' => 790.00,
                'payable_amount' => 790.00,
                'notes' => 'Office delivery - after office hours preferred.',
                'created_at' => now()->subHours(18),
                'updated_at' => now()->subHours(12),
            ],
            [
                'order_number' => 'ORD-2025-008',
                'user_id' => 6, // Seller One (staff order)
                'customer_name' => 'Seller One',
                'customer_phone' => '01711111116',
                'customer_email' => 'seller1@hooknhunt.com',
                'shipping_address' => 'Mohammadpur, Dhaka-1207',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'confirmed',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 320.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 385.00,
                'payable_amount' => 385.00,
                'notes' => 'Staff order - staff discount applied.',
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(8),
            ],
            [
                'order_number' => 'ORD-2025-009',
                'user_id' => 7, // Seller Two (staff order)
                'customer_name' => 'Seller Two',
                'customer_phone' => '01711111117',
                'customer_email' => 'seller2@hooknhunt.com',
                'shipping_address' => 'Khilgaon, Dhaka-1219',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'pending',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 180.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 245.00,
                'payable_amount' => 245.00,
                'notes' => 'Staff order for personal use.',
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subHours(6),
            ],
            [
                'order_number' => 'ORD-2025-010',
                'user_id' => 14, // Fahim Customer (retail customer) - Repeat customer
                'customer_name' => 'Fahim Customer',
                'customer_phone' => '01811111115',
                'customer_email' => 'fahim@gmail.com',
                'shipping_address' => 'Uttara Sector 7, House 15, Road 2, Dhaka-1230',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'pending',
                'payment_method' => 'mobile',
                'payment_details' => 'Nagad payment pending',
                'subtotal' => 450.00,
                'delivery_charge' => 60.00,
                'service_charge' => 5.00,
                'coupon_discount' => 0.00,
                'total_amount' => 515.00,
                'payable_amount' => 515.00,
                'notes' => 'Payment will be made via Nagad upon delivery.',
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(3),
            ],
            [
                'order_number' => 'ORD-2025-011',
                'user_id' => 12, // Abdul Wholesaler (wholesale customer) - Repeat customer
                'customer_name' => 'Abdul Wholesaler',
                'customer_phone' => '01811111113',
                'customer_email' => 'abdul@wholesale.com',
                'shipping_address' => 'Market Area, Shop 12, Mirpur-1, Dhaka-1216',
                'shipping_city' => 'Dhaka',
                'shipping_district' => 'Dhaka',
                'status' => 'confirmed',
                'payment_method' => 'cod',
                'payment_details' => null,
                'subtotal' => 4500.00,
                'delivery_charge' => 0.00, // Free for wholesale
                'service_charge' => 5.00,
                'coupon_discount' => 200.00,
                'total_amount' => 4305.00,
                'payable_amount' => 4305.00,
                'notes' => 'Bulk wholesale order - urgent delivery required.',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(1),
            ],
        ];

        // Insert orders without duplicates, checking if users exist
        foreach ($orders as $order) {
            // Check if user exists before creating order
            $userExists = \App\Models\User::find($order['user_id']);
            if ($userExists) {
                Order::firstOrCreate(
                    ['order_number' => $order['order_number']],
                    $order
                );
            }
        }
    }
}