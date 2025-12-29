<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    public function index()
    {
        return Role::withCount('users')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description
        ]);

        return response()->json($role, 201);
    }

    public function show($id)
    {
        return Role::with('permissions')->findOrFail($id);
    }

    // Sync Permissions to Role (The Custom Logic)
    public function syncPermissions(Request $request, $id)
    {
        $request->validate([
            'permissions' => 'required|array', // Array of permission IDs
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::findOrFail($id);
        
        // Pivot Table Sync
        $role->permissions()->sync($request->permissions);

        return response()->json(['message' => 'Permissions updated successfully']);
    }
}