<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use App\Models\Otp;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * 1. Register User & Send OTP
     */
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            // ডিফল্ট রোল সেট করা (Retail Customer)
            $customerRole = \App\Models\Role::where('slug', 'retail_customer')->first();

            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $customerRole ? $customerRole->id : null,
                'is_active' => false, // OTP ভেরিফাই না করা পর্যন্ত ইনঅ্যাক্টিভ
            ]);

            // প্রোফাইল তৈরি (User Observer দিয়েও করা যায়, তবে এখানে সেফ)
            $user->profile()->create();

            // OTP পাঠানো
            $this->sendOtp($user->phone, $user->id);

            DB::commit();

            return $this->sendSuccess(null, 'Registration successful. Please verify OTP sent to your phone.', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Registration failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 2. Verify OTP & Activate Account
     */
    public function verifyOtp(VerifyOtpRequest $request)
    {
        // Find latest OTP
        $otpRecord = Otp::where('identifier', $request->phone)
                        ->where('token', $request->otp)
                        ->first();

        // Check validity
        if (!$otpRecord || !$otpRecord->isValid()) {
            return $this->sendValidationError(['otp' => ['Invalid or expired OTP code.']]);
        }

        // Activate User
        $user = User::where('phone', $request->phone)->first();
        
        if ($user->phone_verified_at) {
            return $this->sendSuccess(null, 'Account is already verified. Please login.');
        }

        $user->update([
            'phone_verified_at' => now(),
            'is_active' => true
        ]);

        // Delete used OTP
        $otpRecord->delete();

        // Auto Login after verification
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->sendSuccess([
            'access_token' => $token,
            'user' => $user->load('role')
        ], 'Phone verified successfully.');
    }

    /**
     * 3. Login (Updated with Phone Verification Check)
     */
    public function login(LoginRequest $request)
    {
        $fieldType = filter_var($request->login_id, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = User::with('role.permissions')->where($fieldType, $request->login_id)->first();

        // 1. Credentials Check
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->sendError('Invalid credentials', null, 401);
        }

        // 2. Verification Check (Phone verification mandatory)
        // 2. Verification Check
        if (!$user->phone_verified_at) {
            // Updated Line: Passing $user->id
            $this->sendOtp($user->phone, $user->id); 
            
            return $this->sendError('Phone number not verified.', ['action' => 'verify_otp', 'phone' => $user->phone], 403);
        }

        // 3. Status Check (Ban/Inactive)
        if (!$user->is_active) {
            return $this->sendError('Account is currently inactive/suspended.', null, 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->sendSuccess([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 'Login successful');
    }

    /**
     * 4. Resend OTP Helper
     */
    public function resendOtp(Request $request)
    {
        $request->validate(['phone' => 'required|exists:users,phone']);
        
        $user = User::where('phone', $request->phone)->first();
        $this->sendOtp($request->phone, $user->id);
        
        return $this->sendSuccess(null, 'OTP sent successfully.');
    }

    /**
     * Private Helper: Send SMS
     */
    private function sendOtp($phone, $userId)
    {
        // 1. Delete old OTPs for this phone
        Otp::where('identifier', $phone)->delete();

        // 2. Generate 4 Digit Code
        $code = rand(1000, 9999);

        // 3. Store in DB (Added user_id)
        Otp::create([
            'user_id' => $userId, // <--- NEW ADDITION
            'identifier' => $phone,
            'token' => $code,
            'expires_at' => Carbon::now()->addMinutes(5)
        ]);

        // 4. Send SMS Log
        \Log::info("OTP for User ID {$userId} ({$phone}): {$code}");
    }
}