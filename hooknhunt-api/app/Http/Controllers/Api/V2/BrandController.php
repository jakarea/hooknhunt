<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Brand::latest();
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        return $this->sendSuccess($query->paginate(20));
    }

    public function dropdown()
    {
        return $this->sendSuccess(Brand::select('id', 'name')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:brands,name']);

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'logo_id' => $request->logo_id ?? null, // Media File ID
            'website' => $request->website
        ]);

        return $this->sendSuccess($brand, 'Brand created', 201);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);
        $brand->update($request->all());
        return $this->sendSuccess($brand, 'Brand updated');
    }

    public function destroy($id)
    {
        Brand::destroy($id);
        return $this->sendSuccess(null, 'Brand deleted');
    }
}