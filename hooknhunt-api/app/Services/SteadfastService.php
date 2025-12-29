<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteadfastService
{
    private $baseUrl;
    private $apiKey;
    private $secretKey;

    public function __construct()
    {
        $this->baseUrl = env('STEADFAST_BASE_URL', 'https://portal.steadfast.com.bd/api/v1');
        $this->apiKey = env('STEADFAST_API_KEY');
        $this->secretKey = env('STEADFAST_SECRET_KEY');
    }

    /**
     * Send Order to Steadfast (Create Consignment)
     */
    public function createOrder($order)
    {
        // 1. Prepare Payload according to Steadfast Documentation
        $payload = [
            'invoice' => $order->invoice_no,
            'recipient_name' => $order->customer->name,
            'recipient_phone' => $order->customer->phone,
            'recipient_address' => $order->customer->shipping_address ?? $order->customer->address,
            'cod_amount' => $order->due_amount, // শুধু বাকি টাকা কালেকশন হবে
            'note' => 'Handle with care',
        ];

        try {
            // 2. Send Request
            $response = Http::withHeaders([
                'Api-Key' => $this->apiKey,
                'Secret-Key' => $this->secretKey,
                'Content-Type' => 'application/json'
            ])->post("{$this->baseUrl}/create_order", $payload);

            $result = $response->json();

            // 3. Log for debugging
            Log::info("Steadfast Response for Order #{$order->invoice_no}:", $result);

            // 4. Return formatted response
            if (isset($result['status']) && $result['status'] == 200) {
                return [
                    'success' => true,
                    'consignment_id' => $result['consignment']['consignment_id'],
                    'tracking_code' => $result['consignment']['tracking_code'],
                    'msg' => 'Order placed to courier successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'msg' => $result['errors']['invoice'][0] ?? 'Failed to place order in Steadfast'
                ];
            }

        } catch (\Exception $e) {
            Log::error("Steadfast API Error: " . $e->getMessage());
            return ['success' => false, 'msg' => 'Connection error with Courier API'];
        }
    }

    /**
     * Check Delivery Status
     */
    public function checkStatus($consignmentId)
    {
        $response = Http::withHeaders([
            'Api-Key' => $this->apiKey,
            'Secret-Key' => $this->secretKey
        ])->get("{$this->baseUrl}/status_by_cid/$consignmentId");

        return $response->json();
    }
}