<?php

namespace App\Http\Controllers\Api\V1\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    /**
     * Get the authenticated user's details.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('addresses');
        return response()->json([
            'user' => $user
        ]);
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
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'whatsapp_number', 'email', 'address', 'city', 'district'));

        return response()->json(['message' => 'Profile updated successfully.', 'user' => $user]);
    }

    /**
     * Get the authenticated user's addresses.
     */
    public function getAddresses(Request $request)
    {
        return $request->user()->addresses;
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
     * Update an address for the user.
     */
    public function updateAddress(Request $request, Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|in:shipping,billing',
            'is_default' => 'boolean',
            'full_name' => 'sometimes|required|string|max:255',
            'address_line_1' => 'sometimes|required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'district' => 'sometimes|required|string|max:100',
            'post_code' => 'nullable|string|max:20',
            'phone_number' => 'sometimes|required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $address->update($request->all());

        return response()->json(['message' => 'Address updated successfully.', 'address' => $address]);
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