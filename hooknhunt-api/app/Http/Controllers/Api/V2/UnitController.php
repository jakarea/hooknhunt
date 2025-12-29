<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index()
    {
        return Unit::latest()->get();
    }

    // Lightweight list for Select Box
    public function dropdown()
    {
        return Unit::select('id', 'name', 'symbol', 'allow_decimal')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:units,name',
            'symbol' => 'required',
            'allow_decimal' => 'boolean'
        ]);

        $unit = Unit::create($validated);
        return response()->json($unit, 201);
    }

    public function update(Request $request, $id)
    {
        $unit = Unit::findOrFail($id);
        $unit->update($request->all());
        return response()->json($unit);
    }

    public function destroy($id)
    {
        Unit::destroy($id);
        return response()->json(['message' => 'Unit deleted']);
    }
}