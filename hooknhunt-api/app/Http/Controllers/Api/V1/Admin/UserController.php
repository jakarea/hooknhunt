<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::whereNotIn('role', ['retail_customer', 'wholesale_customer'])
            ->paginate();

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'whatsapp_number' => $request->whatsapp_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_verified_at' => now(), // Staff users are pre-verified
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // Prevent editing super_admin if not a super_admin
        if (auth()->user()->role !== 'super_admin' && $user->role === 'super_admin') {
            return response()->json(['message' => 'Forbidden. Cannot modify super admin users.'], 403);
        }

        $data = $request->except('password');

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting the super_admin or self
        if ($user->role === 'super_admin' || $user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete this user.'], 403);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Verify user phone number
     */
    public function verifyPhone(User $user)
    {
        // Only admin and super_admin can verify users
        if (!in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden. Only admins can verify users.'], 403);
        }

        $user->update([
            'phone_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'User phone number verified successfully.',
            'user' => $user
        ]);
    }

    /**
     * Unverify user phone number
     */
    public function unverifyPhone(User $user)
    {
        // Only admin and super_admin can unverify users
        if (!in_array(auth()->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Forbidden. Only admins can unverify users.'], 403);
        }

        // Prevent unverifying super_admin
        if ($user->role === 'super_admin') {
            return response()->json(['message' => 'Cannot unverify super admin users.'], 403);
        }

        $user->update([
            'phone_verified_at' => null,
        ]);

        return response()->json([
            'message' => 'User phone number unverified successfully.',
            'user' => $user
        ]);
    }
}