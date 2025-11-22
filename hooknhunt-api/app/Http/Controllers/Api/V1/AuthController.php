<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'retail_customer',
            'otp_code' => rand(100000, 999999),
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        return response()->json(['message' => 'Registration successful. Please verify your phone.'], 201);
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * Send OTP to a user.
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

        if ($user && is_null($user->phone_verified_at)) {
            $user->otp_code = rand(100000, 999999);
            $user->otp_expires_at = now()->addMinutes(5);
            $user->save();

            return response()->json(['message' => 'OTP sent successfully.']);
        }

        return response()->json(['message' => 'User already verified or does not exist.'], 400);
    }

    /**
     * Verify OTP and log in the user.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|exists:users,phone_number',
            'otp_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)
            ->where('otp_code', $request->otp_code)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 400);
        }

        $user->phone_verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return $request->user()->load('addresses');
    }

    /**
     * Log out the user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Update the user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'whatsapp_number' => 'nullable|string|max:20',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'whatsapp_number', 'email'));

        return response()->json(['message' => 'Profile updated successfully.', 'user' => $user]);
    }

    /**
     * Add a new address for the user.
     */
    public function addAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:shipping,billing',
            'is_default' => 'boolean',
            'full_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'post_code' => 'nullable|string|max:20',
            'phone_number' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $address = Auth::user()->addresses()->create($request->all());

        return response()->json(['message' => 'Address added successfully.', 'address' => $address], 201);
    }

    /**
     * Delete an address for the user.
     */
    public function deleteAddress(Request $request, Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully.']);
    }
}