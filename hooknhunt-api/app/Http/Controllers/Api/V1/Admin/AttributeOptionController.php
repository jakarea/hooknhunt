<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttributeOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttributeOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attribute_id' => 'required|exists:attributes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return AttributeOption::where('attribute_id', $request->attribute_id)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attribute_id' => 'required|exists:attributes,id',
            'value' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $attributeOption = AttributeOption::create($request->all());

        return response()->json($attributeOption, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AttributeOption $attributeOption)
    {
        return $attributeOption;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttributeOption $attributeOption)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $attributeOption->update($request->all());

        return response()->json($attributeOption);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttributeOption $attributeOption)
    {
        $attributeOption->delete();

        return response()->json(null, 204);
    }
}