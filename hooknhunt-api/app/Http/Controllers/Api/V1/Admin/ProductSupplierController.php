<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProductSupplierController extends Controller
{
    /**
     * Attach or update a supplier for a product.
     *
     * @param Request $request
     * @param Product $product
     * @return JsonResponse
     * @throws ValidationException
     */
    public function store(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'supplier_product_urls' => 'required|array|min:1',
            'supplier_product_urls.*' => 'required|url',
        ]);

        try {
            $supplier = Supplier::findOrFail($validated['supplier_id']);

            // Use syncWithoutDetaching to attach or update the supplier
            $product->suppliers()->syncWithoutDetaching([
                $supplier->id => [
                    'supplier_product_urls' => json_encode($validated['supplier_product_urls']),
                ]
            ]);

            // Return the updated list of suppliers for that product
            $suppliers = $product->suppliers()->withPivot('supplier_product_urls')->get();

            return response()->json([
                'success' => true,
                'message' => 'Supplier attached successfully to product',
                'data' => $suppliers->map(function ($supplier) {
                    $supplierData = $supplier->toArray();
                    $supplierData['pivot']['supplier_product_urls'] = json_decode($supplierData['pivot']['supplier_product_urls'], true) ?? [];
                    return $supplierData;
                })
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to attach supplier to product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detach a supplier from a product.
     *
     * @param Product $product
     * @param Supplier $supplier
     * @return JsonResponse
     */
    public function destroy(Product $product, Supplier $supplier): JsonResponse
    {
        try {
            $product->suppliers()->detach($supplier->id);

            return response()->json([
                'success' => true,
                'message' => 'Supplier detached successfully from product'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to detach supplier from product: ' . $e->getMessage()
            ], 500);
        }
    }
}