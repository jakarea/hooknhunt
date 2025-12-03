<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user (Simple: Phone + Password only).
     * OTP will be sent automatically for verification.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|regex:/^01[3-9]\d{8}$/|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate OTP
        $otpCode = rand(100000, 999999);

        $user = User::create([
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'retail_customer',
            'otp_code' => $otpCode,
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        // TODO: Send OTP via SMS (integrate SMS gateway here)
        // For now, return OTP in response (ONLY FOR DEVELOPMENT)
        return response()->json([
            'message' => 'Registration successful. Please verify your phone with OTP.',
            'phone_number' => $user->phone_number,
            'otp_code' => $otpCode, // Remove this in production
        ], 201);
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
        $otpCode = rand(100000, 999999);
        $user->otp_code = $otpCode;
        $user->otp_expires_at = now()->addMinutes(5);
        $user->save();

        // TODO: Send OTP via SMS (integrate SMS gateway here)
        // For now, return OTP in response (ONLY FOR DEVELOPMENT)
        return response()->json([
            'message' => 'OTP sent successfully.',
            'otp_code' => $otpCode, // Remove this in production
        ]);
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
}