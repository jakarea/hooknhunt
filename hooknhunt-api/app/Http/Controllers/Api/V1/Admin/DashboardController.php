<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Supplier;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index(): JsonResponse
    {
        // Get total users count
        $totalUsers = User::count();

        // Get total products count
        $totalProducts = Product::count();

        // Get total purchase orders count (placeholder for sales orders)
        $totalOrders = PurchaseOrder::count();

        // Get total revenue from purchase orders (placeholder for sales revenue)
        $totalRevenue = PurchaseOrder::sum('total_amount');

        // Get recent activity
        $recentActivity = [];

        // Recent users (last 5)
        $recentUsers = User::latest()->take(2)->get(['id', 'name', 'created_at']);
        foreach ($recentUsers as $user) {
            $recentActivity[] = [
                'id' => $user->id,
                'type' => 'user',
                'message' => "User {$user->name} registered",
                'time' => $user->created_at,
                'color' => 'purple',
            ];
        }

        // Recent products (last 5)
        $recentProducts = Product::latest()->take(2)->get(['id', 'base_name', 'created_at']);
        foreach ($recentProducts as $product) {
            $recentActivity[] = [
                'id' => $product->id,
                'type' => 'product',
                'message' => "Product {$product->base_name} added",
                'time' => $product->created_at,
                'color' => 'blue',
            ];
        }

        // Recent purchase orders (last 3)
        $recentOrders = PurchaseOrder::latest()->take(3)->get(['id', 'po_number', 'status', 'created_at']);
        foreach ($recentOrders as $order) {
            $recentActivity[] = [
                'id' => $order->id,
                'type' => 'order',
                'message' => "Purchase Order #{$order->po_number} created",
                'time' => $order->created_at,
                'color' => 'green',
            ];
        }

        // Recent suppliers (last 2)
        $recentSuppliers = Supplier::latest()->take(2)->get(['id', 'shop_name', 'created_at']);
        foreach ($recentSuppliers as $supplier) {
            $recentActivity[] = [
                'id' => $supplier->id,
                'type' => 'supplier',
                'message' => "Supplier {$supplier->shop_name} updated",
                'time' => $supplier->created_at,
                'color' => 'orange',
            ];
        }

        // Sort all activities by time
        usort($recentActivity, function($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });

        // Take only the latest 5 activities
        $recentActivity = array_slice($recentActivity, 0, 5);

        // Calculate relative time
        foreach ($recentActivity as &$activity) {
            $activity['relative_time'] = $this->getRelativeTime($activity['time']);
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'recent_activity' => $recentActivity,
        ]);
    }

    /**
     * Get relative time string
     */
    private function getRelativeTime($datetime): string
    {
        $time = strtotime($datetime);
        $now = time();
        $diff = $now - $time;

        if ($diff < 60) {
            return $diff . ' minutes ago';
        } elseif ($diff < 3600) {
            return floor($diff / 60) . ' minutes ago';
        } elseif ($diff < 86400) {
            return floor($diff / 3600) . ' hours ago';
        } elseif ($diff < 604800) {
            return floor($diff / 86400) . ' days ago';
        } else {
            return date('M d, Y', $time);
        }
    }
}
