<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Place a new order
     */
    public function placeOrder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:100',
            'shipping_district' => 'required|string|max:100',
            'payment_method' => 'required|in:cod,mobile,card',
            'payment_details' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.product_name' => 'required|string|max:255',
            'items.*.product_sku' => 'nullable|string|max:100',
            'items.*.product_image' => 'required|string|max:500',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.total_price' => 'required|numeric|min:0',
            'items.*.product_attributes' => 'nullable|array',
            'subtotal' => 'required|numeric|min:0',
            'delivery_charge' => 'required|numeric|min:0',
            'service_charge' => 'required|numeric|min:0',
            'coupon_discount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payable_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get authenticated user if available
            $user = Auth::user();

            // Prepare order data
            $orderData = [
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_district' => $request->shipping_district,
                'payment_method' => $request->payment_method,
                'payment_details' => $request->payment_details,
                'notes' => $request->notes,
                'subtotal' => $request->subtotal,
                'delivery_charge' => $request->delivery_charge,
                'service_charge' => $request->service_charge,
                'coupon_discount' => $request->coupon_discount,
                'total_amount' => $request->total_amount,
                'payable_amount' => $request->payable_amount,
                'status' => 'pending',
            ];

            // Only add user_id if user is authenticated
            if ($user) {
                $orderData['user_id'] = $user->id;
            }

            // Create the order
            $order = Order::create($orderData);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name' => $item['product_name'],
                    'product_sku' => $item['product_sku'] ?? null,
                    'product_image' => $item['product_image'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'total_price' => $item['total_price'],
                    'product_attributes' => $item['product_attributes'] ?? null,
                ]);

                // Update inventory if variant exists
                if (isset($item['variant_id']) && $item['variant_id']) {
                    $variant = ProductVariant::find($item['variant_id']);
                    if ($variant) {
                        // You may need to implement inventory management here
                        // For now, we'll just log it
                        Log::info("Product variant {$item['variant_id']} quantity reduced by {$item['quantity']}");
                    }
                }
            }

            // Update user information if user is logged in
            if ($user) {
                $user->update([
                    'name' => $request->customer_name,
                    'phone_number' => $request->customer_phone,
                    'email' => $request->customer_email ?? $user->email,
                    'address' => $request->shipping_address,
                    'city' => $request->shipping_city,
                    'district' => $request->shipping_district,
                ]);

                Log::info("User {$user->id} information updated during checkout");
            }

            DB::commit();

            // Load order with relationships for response
            $order->load(['items', 'user']);

            Log::info("Order placed successfully", [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'user_id' => $user?->id,
                'total_amount' => $order->total_amount,
            ]);

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Order placement failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Order placement failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Get order details
     */
    public function show(Order $order): JsonResponse
    {
        // Check if user owns the order or is admin
        if (Auth::id() !== $order->user_id && !Auth::user()?->hasRole(['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $order->load(['items', 'user']);

        return response()->json($order);
    }

    /**
     * Get user orders
     */
    public function myOrders(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['items'])
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }
}