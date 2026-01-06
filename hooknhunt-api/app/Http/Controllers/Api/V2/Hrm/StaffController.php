<?php

namespace App\Http\Controllers\Api\V2\Hrm;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    use ApiResponse;

    /**
     * List all Staff (Non-Customer Users)
     */
    public function index(Request $request)
    {
        // Permission check: Need hrm.staff.index permission
        if (!auth()->user()->hasPermissionTo('hrm.staff.index')) {
            return $this->sendError('You do not have permission to view staff.', null, 403);
        }

        // আমরা ধরে নিচ্ছি role_id = 5 হলো 'Retail Customer'।
        // তাই ৫ বাদে বাকি সব রোল (Admin, Manager, Staff) লোড করব।
        // আপনার সিস্টেমে রোলের ID ভিন্ন হতে পারে, সেটা চেক করে নেবেন।

        $query = User::with(['profile.department', 'role'])
            ->whereHas('role', function($q) {
                $q->where('slug', '!=', 'retail_customer')
                  ->where('slug', '!=', 'wholesale_customer');
            });

        if ($request->department_id) {
            $query->whereHas('profile', fn($q) => $q->where('department_id', $request->department_id));
        }

        return $this->sendSuccess($query->paginate(20), 'Staff list fetched');
    }

    /**
     * Create New Staff
     */
    public function store(Request $request)
    {
        // Permission check: Need hrm.staff.create permission
        if (!auth()->user()->hasPermissionTo('hrm.staff.create')) {
            return $this->sendError('You do not have permission to create staff.', null, 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id', // Must assign a role (e.g. Manager)

            // Profile / HRM Fields
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required|string',
            'base_salary' => 'required|numeric|min:0',
            'joining_date' => 'nullable|date',
            'address' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // 1. Create User Logic
            $user = User::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $request->role_id,
                'is_active' => true
            ]);

            // 2. Create Profile with Job Info
            UserProfile::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'designation' => $request->designation,
                'base_salary' => $request->base_salary,
                'joining_date' => $request->joining_date ?? now(),
                'address' => $request->address
            ]);

            DB::commit();
            return $this->sendSuccess($user->load('profile.department'), 'Staff member onboarded successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Show Staff Details
     */
    public function show($id)
    {
        $staff = User::with(['profile.department', 'role', 'attendances' => function($q) {
            $q->latest()->take(30); // Last 30 days attendance
        }])->findOrFail($id);

        // Permission check: Users can view their own profile OR need hrm.staff.view/hrm.staff.index permission
        $currentUser = auth()->user();
        if ($currentUser->id != $id) {
            // Viewing someone else's profile - check permission
            if (!$currentUser->hasPermissionTo('hrm.staff.view') && !$currentUser->hasPermissionTo('hrm.staff.index')) {
                return $this->sendError('You do not have permission to view staff profiles.', null, 403);
            }
        }

        return $this->sendSuccess($staff);
    }

    /**
     * Update Staff Info & Salary
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Permission check: Users can edit their own profile OR need hrm.staff.edit permission
        $currentUser = auth()->user();
        if ($currentUser->id != $id) {
            // Editing someone else's profile - check permission
            if (!$currentUser->hasPermissionTo('hrm.staff.edit')) {
                return $this->sendError('You do not have permission to edit staff profiles.', null, 403);
            }
        }

        $request->validate([
            'name' => 'required|string',
            'phone' => ['required', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'exists:roles,id',
            'base_salary' => 'numeric|min:0'
        ]);

        DB::beginTransaction();
        try {
            // Update Basic Info
            $user->update($request->only(['name', 'phone', 'email', 'role_id', 'is_active']));

            // Update Job Info
            $profileData = $request->only([
                'department_id', 'designation', 'base_salary', 'joining_date', 'address'
            ]);
            
            // updateOrCreate ব্যবহার করছি যাতে প্রোফাইল না থাকলে তৈরি হয়ে যায়
            UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );

            DB::commit();
            return $this->sendSuccess($user->load('profile'), 'Staff updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Terminate / Remove Staff
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent users from deleting themselves - NO ONE can delete themselves
        if ($user->id === auth()->id()) {
            return $this->sendError('You cannot delete your own account.', null, 400);
        }

        // Permission check: Need hrm.staff.delete permission
        if (!auth()->user()->hasPermissionTo('hrm.staff.delete')) {
            return $this->sendError('You do not have permission to delete staff.', null, 403);
        }

        // Soft Delete (History will remain)
        $user->delete();

        return $this->sendSuccess(null, 'Staff terminated successfully');
    }
}