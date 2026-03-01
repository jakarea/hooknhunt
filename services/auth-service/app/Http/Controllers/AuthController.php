<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register new user (with OTP verification).
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6|confirmed',
            'user_type' => 'nullable|in:customer,staff,supplier,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'user_type' => $request->user_type ?? 'customer',
                'is_active' => false, // Inactive until OTP verified
            ]);

            // Send OTP
            $this->sendOtp($user->phone, $user->id);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Registration successful. Please verify OTP sent to your phone.',
                'data' => [
                    'user_id' => $user->id,
                    'phone' => $user->phone,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Registration failed',
                'errors' => ['exception' => $e->getMessage()],
            ], 500);
        }
    }

    /**
     * Verify OTP and activate account.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Find OTP record
        $otpRecord = Otp::where('identifier', $request->phone)
            ->where('token', $request->otp)
            ->first();

        if (!$otpRecord || !$otpRecord->isValid()) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired OTP code.',
                'errors' => ['otp' => ['Invalid or expired OTP code.']],
            ], 422);
        }

        // Activate user
        $user = User::where('phone', $request->phone)->first();

        if ($user->phone_verified_at) {
            return response()->json([
                'status' => true,
                'message' => 'Account already verified. Please login.',
            ]);
        }

        $user->update([
            'phone_verified_at' => now(),
            'is_active' => true,
        ]);

        // Delete used OTP
        $otpRecord->delete();

        // Auto-login after verification
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Phone verified successfully.',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ],
        ]);
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Determine if email or phone
        $fieldType = filter_var($request->login_id, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = User::where($fieldType, $request->login_id)->first();

        // User not found
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => "User not found with {$fieldType}: {$request->login_id}",
                'errors' => [
                    'credentials' => 'Invalid credentials',
                ],
            ], 401);
        }

        // Invalid password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid password',
                'errors' => [
                    'credentials' => 'Invalid credentials',
                ],
            ], 401);
        }

        // Phone not verified
        if (!$user->phone_verified_at) {
            $this->sendOtp($user->phone, $user->id);

            return response()->json([
                'status' => false,
                'message' => 'Phone not verified. OTP sent to your phone.',
                'errors' => [
                    'verification' => 'Phone not verified',
                    'action' => 'verify_otp',
                    'phone' => $user->phone,
                ],
            ], 403);
        }

        // Account inactive
        if (!$user->is_active) {
            return response()->json([
                'status' => false,
                'message' => 'Account is inactive or suspended.',
                'errors' => [
                    'account' => 'Account inactive',
                ],
            ], 403);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ],
        ]);
    }

    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'Profile retrieved successfully',
            'data' => [
                'user' => $request->user(),
            ],
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Resend OTP.
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|exists:users,phone',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();
        $this->sendOtp($request->phone, $user->id);

        return response()->json([
            'status' => true,
            'message' => 'OTP sent successfully.',
        ]);
    }

    /**
     * Update profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|unique:users,phone,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update($request->only(['name', 'email', 'phone']));

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Current password is incorrect',
                'errors' => [
                    'current_password' => ['Current password is incorrect'],
                ],
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Send OTP to phone.
     */
    private function sendOtp($phone, $userId)
    {
        // Delete old OTPs
        Otp::where('identifier', $phone)->delete();

        // Generate 4-digit code
        $code = rand(1000, 9999);

        // Store in database
        Otp::create([
            'user_id' => $userId,
            'identifier' => $phone,
            'token' => $code,
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);

        // Log OTP (in production, integrate with SMS gateway)
        \Log::info("OTP for User ID {$userId} ({$phone}): {$code}");
    }
}
