<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['super_admin', 'admin', 'seller', 'store_keeper', 'marketer'])],
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $auth_user = auth()->user();
        if ($auth_user->role !== 'super_admin' && $request->role === 'super_admin') {
            return response()->json(['message' => 'Forbidden. Only super admins can create other super admins.'], 403);
        }

        $user = User::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
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
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone_number' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role' => ['sometimes', 'required', Rule::in(['super_admin', 'admin', 'seller', 'store_keeper', 'marketer'])],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $auth_user = auth()->user();
        if ($auth_user->role !== 'super_admin' && $request->role === 'super_admin') {
            return response()->json(['message' => 'Forbidden. Only super admins can promote users to super admin.'], 403);
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
}