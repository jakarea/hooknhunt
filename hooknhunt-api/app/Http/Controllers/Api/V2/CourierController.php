<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Services\SteadfastService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CourierController extends Controller
{
    use ApiResponse;

    protected $courierService;

    public function __construct(SteadfastService $service)
    {
        $this->courierService = $service;
    }

    /**
     * 1. Book an Order to Courier (Single)
     */
    public function bookOrder($orderId)
    {
        $order = SalesOrder::with('customer')->findOrFail($orderId);

        if ($order->courier_tracking_id) {
            return $this->sendError('Order already booked.', ['tracking_id' => $order->courier_tracking_id]);
        }

        $result = $this->courierService->createOrder($order);

        if ($result['success']) {
            $order->update([
                'courier_tracking_id' => $result['tracking_code'],
                'status' => 'shipped',
                'shipped_at' => now()
            ]);
            return $this->sendSuccess($result, 'Shipment booked successfully!');
        } else {
            return $this->sendError($result['msg']);
        }
    }

    /**
     * 2. Check Status (Single)
     */
    public function checkStatus($trackingCode)
    {
        $status = $this->courierService->checkStatus($trackingCode);
        return $this->sendSuccess($status);
    }

    /**
     * 3. Bulk Status Check (For Cron Job / Admin Button)
     * এটি পেন্ডিং সব অর্ডারের স্ট্যাটাস চেক করে আপডেট করবে
     */
    public function bulkStatusUpdate()
    {
        // যেসব অর্ডার শিপড হয়েছে কিন্তু ডেলিভারড হয়নি
        $orders = SalesOrder::whereNotNull('courier_tracking_id')
                    ->where('status', 'shipped')
                    ->take(20) // API লিমিট এড়াতে ২০টা করে চেক করি
                    ->get();

        $updatedCount = 0;

        foreach ($orders as $order) {
            $response = $this->courierService->checkStatus($order->courier_tracking_id);
            
            // Steadfast এর স্ট্যাটাস রেসপন্স অনুযায়ী লজিক (API Doc দেখে ম্যাপিং করতে হবে)
            if (isset($response['delivery_status'])) {
                $status = strtolower($response['delivery_status']);
                
                if ($status == 'delivered') {
                    $order->update(['status' => 'delivered']);
                    // এখানে Loyalty Point বা Payment লজিক কল করা যেতে পারে
                    $updatedCount++;
                } 
                elseif ($status == 'cancelled' || $status == 'returned') {
                    $order->update(['status' => 'returned']);
                    // রিটার্ন লজিক হ্যান্ডেল করতে হবে
                    $updatedCount++;
                }
            }
        }

        return $this->sendSuccess(null, "$updatedCount orders status updated.");
    }
}