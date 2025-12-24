<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\AlphaSmsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $smsService;

    public function __construct(AlphaSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

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

            // Check if phone number exists in users table
            $existingUser = User::where('phone_number', $request->customer_phone)->first();
            $isNewUser = false;
            $generatedPassword = null;

            // If no authenticated user and phone doesn't exist, create new user
            if (!$user && !$existingUser) {
                // Generate 8-digit password
                $generatedPassword = str_pad(rand(0, 99999999), 8, '0', STR_PAD_LEFT);

                // Generate OTP for phone verification
                $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

                $newUser = User::create([
                    'name' => $request->customer_name,
                    'phone_number' => $request->customer_phone,
                    'email' => $request->customer_email,
                    'password' => Hash::make($generatedPassword),
                    'role' => 'retail_customer',
                    'address' => $request->shipping_address,
                    'city' => $request->shipping_city,
                    'district' => $request->shipping_district,
                    'otp_code' => $otpCode,
                    'otp_expires_at' => now()->addMinutes(5),
                    // phone_verified_at will be null until OTP is verified
                ]);

                $user = $newUser;
                $isNewUser = true;

                // Store password in cache for later sending after OTP verification (expires in 1 hour)
                Cache::put("user_password_{$user->phone_number}", $generatedPassword, now()->addHour());

                Log::info("New user created during checkout", [
                    'user_id' => $user->id,
                    'phone_number' => $user->phone_number,
                    'password' => $generatedPassword,
                ]);
            } elseif ($existingUser) {
                // Phone number exists, use existing user
                $user = $existingUser;
            }

            // Determine order status based on whether user needs verification
            $orderStatus = ($isNewUser || ($user && is_null($user->phone_verified_at))) ? 'unverified' : 'pending';

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
                'status' => $orderStatus,
            ];

            // Only add user_id if user exists
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
            if ($user && !$isNewUser) {
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

            // Send OTP if order is unverified
            $otpSent = false;
            $responseOrderData = [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
            ];

            if ($orderStatus === 'unverified') {
                // Send OTP via SMS
                $smsResult = $this->smsService->sendOTP($user->phone_number, $user->otp_code);

                Log::info('Order verification OTP SMS', [
                    'phone' => $user->phone_number,
                    'otp' => $user->otp_code,
                    'sms_result' => $smsResult,
                    'order_id' => $order->id,
                ]);

                $otpSent = true;
                $responseOrderData['phone_number'] = $user->phone_number;
            }

            DB::commit();

            // Load order with relationships for response
            $order->load(['items', 'user']);

            Log::info("Order placed successfully", [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'user_id' => $user?->id,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'is_new_user' => $isNewUser,
            ]);

            $response = [
                'message' => $orderStatus === 'unverified'
                    ? 'Order placed successfully. Please verify your phone number with OTP.'
                    : 'Order placed successfully.',
                'order' => $responseOrderData,
                'verification_required' => $orderStatus === 'unverified',
            ];

            // Include OTP only in development for testing
            if ($orderStatus === 'unverified' && app()->environment('local', 'testing')) {
                $response['otp_code'] = $user->otp_code;
                $response['sms_debug'] = $smsResult ?? null;
            }

            return response()->json($response, 201);

        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollback();

            Log::error('Order placement database error', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'request_data' => $request->all(),
            ]);

            // Check for unique constraint violations
            if (str_contains($e->getMessage(), 'users.phone_number_unique')) {
                return response()->json([
                    'message' => 'This phone number is already registered. Please login to place your order.',
                    'error' => 'Phone number already exists',
                ], 409);
            }

            if (str_contains($e->getMessage(), 'users.email_unique')) {
                return response()->json([
                    'message' => 'This email is already registered. Please use a different email.',
                    'error' => 'Email already exists',
                ], 409);
            }

            return response()->json([
                'message' => 'Database error occurred. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Database error',
            ], 500);

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
                'debug_info' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null,
            ], 500);
        }
    }

    /**
     * Verify OTP for order and send password via SMS
     */
    public function verifyOrder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:users,phone_number',
            'otp_code' => 'required|string|size:6',
            'order_id' => 'required|integer|exists:orders,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Find user by phone number and valid OTP
            $user = User::where('phone_number', $request->phone_number)
                ->where('otp_code', $request->otp_code)
                ->where('otp_expires_at', '>', now())
                ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid or expired OTP. Please request a new one.'
                ], 400);
            }

            // Find the order
            $order = Order::where('id', $request->order_id)
                ->where('customer_phone', $request->phone_number)
                ->where('status', 'unverified')
                ->first();

            if (!$order) {
                return response()->json([
                    'message' => 'Order not found or already verified.'
                ], 404);
            }

            // Mark phone as verified
            $user->phone_verified_at = now();
            $user->otp_code = null;
            $user->otp_expires_at = null;
            $user->save();

            // Update order status to pending
            $order->status = 'pending';
            $order->save();

            // Retrieve password from cache
            $password = Cache::get("user_password_{$user->phone_number}");

            // Send password via SMS if it's a new user (password exists in cache)
            if ($password) {
                $message = "Your Hook & Hunt account has been verified! Your login password is: {$password}. Use this password with your phone number to login. Thank you for shopping with us!";
                $smsResult = $this->smsService->sendSms($message, $user->phone_number);

                Log::info('Password SMS sent after order verification', [
                    'phone' => $user->phone_number,
                    'password' => $password,
                    'sms_result' => $smsResult,
                    'order_id' => $order->id,
                ]);

                // Remove password from cache after sending
                Cache::forget("user_password_{$user->phone_number}");
            }

            DB::commit();

            // Create auth token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Order verified successfully', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'phone_number' => $user->phone_number,
            ]);

            $response = [
                'message' => 'Order verified successfully! You can track your order in your account.',
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                ],
                'token' => $token,
                'user' => $user,
            ];

            // Include password only in development for testing
            if ($password && app()->environment('local', 'testing')) {
                $response['password_sent'] = $password;
                $response['sms_debug'] = $smsResult ?? null;
            }

            return response()->json($response, 200);

        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Order verification failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Order verification failed. Please try again.',
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