<?php

namespace App\Http\Controllers\Api\V2; // Namespace updated to V2

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest; // আমাদের তৈরি করা সেই সিকিউর বেস রিকোয়েস্ট
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use App\Models\Role;
use App\Traits\ApiResponse;



class UserController extends Controller
{
    use ApiResponse;

    /**
     * অ্যাডমিন প্যানেলের জন্য ইউজার লিস্ট (কাস্টমার বাদে বাকি স্টাফরা)
     */
   // ১. ইউজার লিস্ট (ফিল্টারসহ)
/**
     * Display a listing of Users (Isolated Staff or Customer)
     */
    public function index(Request $request)
    {
        $type = $request->query('type'); // 'staff' or 'customer'

        $query = User::with('role');

        if ($type === 'staff') {
            // শুধুমাত্র স্টাফ রোলগুলো ফিল্টার (কাস্টমার বাদে বাকি সব)
            $query->whereHas('role', function($q) {
                $q->whereNotIn('slug', ['retail_customer', 'wholesale_customer']);
            });
        } elseif ($type === 'customer') {
            // শুধুমাত্র কাস্টমার রোলগুলো ফিল্টার
            $query->whereHas('role', function($q) {
                $q->whereIn('slug', ['retail_customer', 'wholesale_customer']);
            });
        } else {
            // যদি টাইপ না থাকে, তবে সিকিউরিটির জন্য খালি রেজাল্ট পাঠানোই প্রফেশনালিজম
            return $this->sendError('User type is required (staff or customer).', null, 400);
        }

        return $this->sendSuccess($query->latest()->paginate(20), ucfirst($type) . ' list retrieved.');
    }

    /**
     * Store a User (With Strict Role Enforcement)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|unique:users,phone',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|min:6',
            'type' => 'required|in:staff,customer', // রিকোয়েস্টে টাইপ থাকা বাধ্যতামূলক
            'email' => 'nullable|email|unique:users,email',

            // Profile fields (optional)
            'profile' => 'nullable|array',
            'profile.department_id' => 'nullable|exists:departments,id',
            'profile.designation' => 'nullable|string|max:255',
            'profile.joining_date' => 'nullable|date',
            'profile.base_salary' => 'nullable|numeric',
            'profile.address' => 'nullable|string',
            'profile.city' => 'nullable|string',
            'profile.dob' => 'nullable|date',
            'profile.gender' => 'nullable|in:male,female,other',
        ]);

        $role = Role::find($request->role_id);

        // ভ্যালিডেশন: স্টাফ রোলে কাস্টমার বা কাস্টমার রোলে স্টাফ ঢুকছে কি না চেক
        if ($request->type === 'staff' && in_array($role->slug, ['retail_customer', 'wholesale_customer'])) {
            return $this->sendError('Invalid role assigned for a Staff user.', null, 422);
        }

        if ($request->type === 'customer' && !in_array($role->slug, ['retail_customer', 'wholesale_customer'])) {
            return $this->sendError('Invalid role assigned for a Customer.', null, 422);
        }

        $user = User::create([
            'name' => strip_tags($request->name),
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'is_active' => true,
            'phone_verified_at' => now(),
        ]);

        // Create profile if provided
        if ($request->has('profile') && is_array($request->profile)) {
            $user->profile()->create($request->profile);
        }

        return $this->sendSuccess($user->load('role', 'profile'), ucfirst($request->type) . ' created successfully.', 201);
    }
    // ৩. ইউজার আপডেট (রোল এবং পারমিশন পরিবর্তন)
   public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone,' . $id,
            'email' => 'nullable|email|unique:users,email,' . $id,
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'sometimes|boolean',
            'password' => 'nullable|min:6',

            // Profile fields (optional)
            'department_id' => 'nullable|exists:departments,id',
            'designation' => 'nullable|string|max:255',
            'joining_date' => 'nullable|date',
            'base_salary' => 'nullable|numeric',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'dob' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
        ]);

        // Update user basic fields
        if($request->has('role_id')) {
            $user->role_id = $validated['role_id'];
        }
        if($request->has('name')) {
            $user->name = $validated['name'];
        }
        if($request->has('phone')) {
            $user->phone = $validated['phone'];
        }
        if($request->has('email')) {
            $user->email = $validated['email'];
        }
        if($request->has('is_active')) {
            $user->is_active = $validated['is_active'];
        }
        if($request->has('password') && !empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update or create profile if any profile field is provided
        $profileFields = ['department_id', 'designation', 'joining_date', 'base_salary', 'address', 'city', 'dob', 'gender'];
        $hasProfileData = false;

        foreach ($profileFields as $field) {
            if ($request->has($field) && !is_null($validated[$field])) {
                $hasProfileData = true;
                break;
            }
        }

        if ($hasProfileData) {
            $profileData = [];

            // Build profile data from request
            foreach ($profileFields as $field) {
                if ($request->has($field)) {
                    $profileData[$field] = $validated[$field] ?? null;
                }
            }

            // Update existing profile or create new one
            if ($user->profile) {
                $user->profile()->update($profileData);
            } else {
                $user->profile()->create($profileData);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'User updated successfully.',
            'data' => $user->load('role', 'profile')
        ]);
    }

    // ৪. ইউজার ব্যান/অ্যাক্টিভ করা
    public function banUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        
        $status = $user->is_active ? 'activated' : 'banned';
        return $this->sendSuccess(null, "User has been {$status}.");
    }

    // ৫. রোল লিস্ট (ড্রপডাউনের জন্য)
    public function roleList(Request $request)
    {
        $type = $request->query('type'); // 'staff' or 'customer'

        $query = Role::query();

        if ($type === 'staff') {
            // শুধুমাত্র স্টাফ রোলগুলো ফিল্টার (কাস্টমার বাদে বাকি সব)
            $query->whereNotIn('slug', ['retail_customer', 'wholesale_customer']);
        } elseif ($type === 'customer') {
            // শুধুমাত্র কাস্টমার রোলগুলো ফিল্টার
            $query->whereIn('slug', ['retail_customer', 'wholesale_customer']);
        }

        return $this->sendSuccess($query->get(), 'Roles retrieved.');
    }

    // ৬. ডিলিট
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return $this->sendError('You cannot delete yourself.', null, 400);
        }
        $user->delete();
        return $this->sendSuccess(null, 'User deleted successfully.');
    }

    public function blockPermission(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $permissionId = $request->permission_id;

        // syncWithoutDetaching ব্যবহার করে is_blocked ১ করে দিন
        $user->directPermissions()->syncWithoutDetaching([
            $permissionId => ['is_blocked' => true]
        ]);

        return response()->json([
            'status' => true,
            'message' => 'পারমিশনটি এই ইউজারের জন্য ব্লক করা হয়েছে।',
        ]);
    }

    public function giveDirectPermission(Request $request, $userId)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $user = User::findOrFail($userId);
        // sync ব্যবহার করলে আগের পারমিশন মুছে নতুনগুলো বসবে
        $user->directPermissions()->sync($request->permissions);

        return $this->sendSuccess(null, 'Personal permissions updated for ' . $user->name);
    }

    public function show($id)
    {
        try {
            $user = \App\Models\User::with([
                'role.permissions:id,name,slug,group_name',
                'directPermissions' => function ($query) {
                    $query->select('permissions.id', 'permissions.name', 'permissions.slug', 'permissions.group_name')
                          ->withPivot('is_blocked');
                },
                'profile' // Load user profile
            ])->findOrFail($id);

            // ১. রোলের পারমিশন থেকে pivot হাইড করা
            if ($user->role) {
                $user->role->permissions->makeHidden('pivot');
            }

            // ২. Separate granted and blocked permissions BEFORE hiding pivot
            $grantedPermissions = $user->directPermissions->filter(function ($perm) {
                return isset($perm->pivot) && $perm->pivot->is_blocked == 0;
            })->makeHidden(['pivot', 'id']);

            $blockedPermissions = $user->directPermissions->filter(function ($perm) {
                return isset($perm->pivot) && $perm->pivot->is_blocked == 1;
            })->makeHidden(['pivot', 'id']);

            // ৩. Hide pivot from remaining directPermissions
            $user->directPermissions->makeHidden('pivot');

            // Role permissions (for reference)
            $rolePermissions = $user->role ? $user->role->permissions : collect([]);

            return response()->json([
                'status' => true,
                'message' => 'User details retrieved.',
                'data' => [
                    'user' => $user,
                    'role_permissions' => $rolePermissions,
                    'granted_permissions' => $grantedPermissions,
                    'blocked_permissions' => $blockedPermissions,
                ],
                'errors' => null
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.',
                'errors' => $e->getMessage(),
                'data' => null
            ], 404);
        }
    }

    // ৭. Sync granted permissions
    public function syncGrantedPermissions(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Sync with is_blocked = 0
        $user->directPermissions()->syncWithPivotValues(
            $request->permissions,
            ['is_blocked' => 0]
        );

        return $this->sendSuccess(null, 'Granted permissions updated.');
    }

    // ৮. Sync blocked permissions
    public function syncBlockedPermissions(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Sync with is_blocked = 1
        $user->directPermissions()->syncWithPivotValues(
            $request->permissions,
            ['is_blocked' => 1]
        );

        return $this->sendSuccess(null, 'Blocked permissions updated.');
    }

}