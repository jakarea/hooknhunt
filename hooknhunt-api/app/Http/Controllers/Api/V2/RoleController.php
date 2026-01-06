<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    use ApiResponse;

    /**
     * স্টাফ অথবা কাস্টমার রোল আলাদাভাবে ড্রপডাউন বা লিস্টে দেখানো
     */
    public function index(Request $request)
    {
        $type = $request->query('type'); // 'staff' or 'customer'

        $query = Role::withCount('users');

        if ($type === 'staff') {
            $query->whereNotIn('slug', ['retail_customer', 'wholesale_customer']);
        } elseif ($type === 'customer') {
            $query->whereIn('slug', ['retail_customer', 'wholesale_customer']);
        }

        return $this->sendSuccess($query->get(), 'Role list retrieved.');
    }

    /**
     * ডাইনামিক রোল তৈরি
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,slug'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description
        ]);

        // রোল তৈরির সময় সরাসরি পারমিশন সিঙ্ক করা (ডাইনামিক)
        if ($request->has('permissions')) {
            // Convert permission slugs to IDs
            $permissionIds = Permission::whereIn('slug', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        return $this->sendSuccess($role->load('permissions'), 'Role created successfully.', 201);
    }

    /**
     * সব পারমিশনের লিস্ট (মডিউল অনুযায়ী গ্রুপ করা)
     * এটি অ্যাডমিন প্যানেলে চেকবক্স সাজাতে সাহায্য করবে
     */
    public function getAllPermissions()
    {
        $permissions = Permission::all()->groupBy('module_name');
        return $this->sendSuccess($permissions, 'Permissions grouped by module.');
    }

    /**
     * Show specific role with permissions
     */
    public function show($id)
    {
        $role = Role::with(['permissions:id,name,slug,group_name', 'users'])->findOrFail($id);
        return $this->sendSuccess($role, 'Role retrieved successfully.');
    }

    /**
     * Update role
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // Prevent modifying super admin role
        if ($role->slug === 'super_admin') {
            return $this->sendError('Super Admin role cannot be modified.', null, 403);
        }

        $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,slug'
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Sync permissions if provided
        if ($request->has('permissions')) {
            // Convert permission slugs to IDs
            $permissionIds = Permission::whereIn('slug', $request->permissions)->pluck('id');
            $role->permissions()->sync($permissionIds);
        }

        return $this->sendSuccess($role->load('permissions'), 'Role updated successfully.');
    }

    /**
     * Delete role
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        // Prevent deleting super admin role
        if ($role->slug === 'super_admin') {
            return $this->sendError('Super Admin role cannot be deleted.', null, 403);
        }

        // Check if role has users (including soft-deleted)
        $userCount = \App\Models\User::withTrashed()->where('role_id', $role->id)->count();
        if ($userCount > 0) {
            return $this->sendError('Cannot delete role with assigned users (including deleted users).', null, 400);
        }

        $role->delete();
        return $this->sendSuccess(null, 'Role deleted successfully.');
    }

    /**
     * ডাইনামিক পারমিশন সিঙ্কিং
     * Accepts permission slugs from frontend and converts to IDs
     */
    public function syncPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        if ($role->slug === 'super_admin') {
            return $this->sendError('Super Admin permissions cannot be modified.', null, 403);
        }

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,slug'
        ]);

        // Convert permission slugs to IDs
        $permissionIds = Permission::whereIn('slug', $request->permissions)->pluck('id');

        // Sync using permission IDs
        $role->permissions()->sync($permissionIds);

        return $this->sendSuccess($role->load('permissions'), 'Permissions synced successfully.');
    }

    public function getPermissions($id)
    {
        try {
            // ১. রোলটি খুঁজে বের করা এবং তার সাথে পারমিশনগুলো লোড করা
            $role = \App\Models\Role::with('permissions:id,name,slug,group_name')->findOrFail($id);

            return response()->json([
                'status' => true,
                'message' => "Permissions for role: {$role->name}",
                'data' => [
                    'role_id' => $role->id,
                    'role_name' => $role->name,
                    'permissions' => $role->permissions
                ],
                'errors' => null
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'রোলের পারমিশন পাওয়া যায়নি।',
                'errors' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

}