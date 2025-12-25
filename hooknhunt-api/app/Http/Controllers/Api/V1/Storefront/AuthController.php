<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AlphaSmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $smsService;

    public function __construct(AlphaSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    /**
     * Register a new user (Full Name, Phone + Password).
     * OTP will be sent automatically for verification.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'phone_number' => 'required|string|regex:/^01[3-9]\d{8}$/|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate OTP
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'retail_customer',
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        // Send OTP via SMS
        $smsResult = $this->smsService->sendOTP($user->phone_number, $otpCode);

        // Log SMS result for debugging
        \Log::info('Registration OTP SMS', [
            'phone' => $user->phone_number,
            'otp' => $otpCode,
            'sms_result' => $smsResult
        ]);

        // In production, don't return OTP code
        $response = [
            'message' => 'Registration successful. Please verify your phone with OTP.',
            'phone_number' => $user->phone_number,
        ];

        // Include OTP only in development for testing
        if (app()->environment('local', 'testing')) {
            $response['otp_code'] = $otpCode;
            $response['sms_debug'] = $smsResult;
        }

        return response()->json($response, 201);
    }

    /**
     * Log in a user.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (is_null($user->phone_verified_at)) {
            return response()->json(['message' => 'Account not verified.'], 403);
        }

        if (!in_array($user->role, ['retail_customer', 'wholesale_customer'])) {
            return response()->json(['message' => 'Access Denied. Use Admin portal.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * Send/Resend OTP to a user's phone number.
     * Used for phone verification after registration.
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:users,phone_number',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            return response()->json(['message' => 'Phone number not found.'], 404);
        }

        // Generate new OTP
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->otp_code = $otpCode;
        $user->otp_expires_at = now()->addMinutes(5);
        $user->save();

        // Send OTP via SMS
        $smsResult = $this->smsService->sendOTP($user->phone_number, $otpCode);

        // Log SMS result for debugging
        \Log::info('Resend OTP SMS', [
            'phone' => $user->phone_number,
            'otp' => $otpCode,
            'sms_result' => $smsResult
        ]);

        $response = [
            'message' => 'OTP sent successfully.',
        ];

        // Include OTP only in development for testing
        if (app()->environment('local', 'testing')) {
            $response['otp_code'] = $otpCode;
            $response['sms_debug'] = $smsResult;
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and mark phone as verified.
     * Returns auth token upon successful verification.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:users,phone_number',
            'otp_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)
            ->where('otp_code', $request->otp_code)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP. Please request a new one.'], 400);
        }

        // Mark phone as verified
        $user->phone_verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        // Create auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Phone verified successfully.',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Test SMS balance (for development/debugging)
     */
    public function testSmsBalance()
    {
        $balance = $this->smsService->getBalance();

        return response()->json([
            'balance_info' => $balance,
            'api_key_configured' => !empty(env('ALPHA_SMS_API_KEY')),
        ]);
    }

    /**
     * Send OTP for password reset.
     * Verifies phone number exists and sends OTP.
     */
    public function sendResetOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|regex:/^01[3-9]\d{8}$/|exists:users,phone_number',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            // For security, still return success even if phone doesn't exist
            return response()->json(['message' => 'If your phone number is registered, you will receive an OTP shortly.']);
        }

        // Generate new OTP for password reset
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->otp_code = $otpCode;
        $user->otp_expires_at = now()->addMinutes(5);
        $user->save();

        // Send OTP via SMS
        $smsResult = $this->smsService->sendOTP($user->phone_number, $otpCode);

        // Log SMS result for debugging
        \Log::info('Password Reset OTP SMS', [
            'phone' => $user->phone_number,
            'otp' => $otpCode,
            'sms_result' => $smsResult
        ]);

        $response = [
            'message' => 'OTP sent successfully. Use it to reset your password.',
        ];

        // Include OTP only in development for testing
        if (app()->environment('local', 'testing')) {
            $response['otp_code'] = $otpCode;
            $response['sms_debug'] = $smsResult;
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and reset password.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:users,phone_number',
            'otp_code' => 'required|string|size:6',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)
            ->where('otp_code', $request->otp_code)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP. Please request a new one.'], 400);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json([
            'message' => 'Password reset successful. You can now login with your new password.'
        ]);
    }
}