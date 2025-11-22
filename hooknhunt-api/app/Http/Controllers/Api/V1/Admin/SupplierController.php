<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Supplier::paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'shop_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:suppliers',
            'shop_url' => 'nullable|url',
            'wechat_id' => 'nullable|string|max:255',
            'wechat_qr_url' => 'nullable|string|max:255',
            'alipay_id' => 'nullable|string|max:255',
            'alipay_qr_url' => 'nullable|string|max:255',
            'contact_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier = Supplier::create($request->all());

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        return $supplier;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'shop_name' => 'nullable|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('suppliers')->ignore($supplier->id)],
            'shop_url' => 'nullable|url',
            'wechat_id' => 'nullable|string|max:255',
            'wechat_qr_url' => 'nullable|string|max:255',
            'alipay_id' => 'nullable|string|max:255',
            'alipay_qr_url' => 'nullable|string|max:255',
            'contact_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier->update($request->all());

        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json(null, 204);
    }
}