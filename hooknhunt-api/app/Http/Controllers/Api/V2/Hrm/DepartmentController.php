<?php

namespace App\Http\Controllers\Api\V2\Hrm;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->sendSuccess(Department::where('is_active', true)->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:departments,name']);
        $dept = Department::create($request->all());
        return $this->sendSuccess($dept, 'Department created');
    }

    public function destroy($id)
    {
        Department::destroy($id);
        return $this->sendSuccess(null, 'Department deleted');
    }
}