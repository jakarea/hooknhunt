<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:permissions,name',
                'slug' => 'required|string|unique:permissions,slug',
                'group_name' => 'required|string'
            ]);

            $permission = Permission::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Permission created successfully.',
                'data' => $permission
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'পারমিশন তৈরি করা সম্ভব হয়নি।',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * সব পারমিশনের লিস্ট (Dropdown বা ACL এর জন্য)
     */
    public function list()
    {
        try {
            $permissions = Permission::select('id', 'name', 'slug', 'group_name')
                ->orderBy('group_name')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Permission list retrieved.',
                'data' => $permissions,
                'errors' => null
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'পারমিশন লিস্ট পাওয়া যায়নি।',
                'errors' => $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}