<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
    public function store(StoreSupplierRequest $request)
    {
        $data = $request->except(['wechat_qr_file', 'alipay_qr_file', 'wechat_qr_media_id', 'alipay_qr_media_id']);

        // Handle WeChat QR code - file upload or media selection
        if ($request->hasFile('wechat_qr_file')) {
            $wechatFile = $request->file('wechat_qr_file');
            $wechatPath = $wechatFile->store('suppliers/qrcodes', 'public');
            $data['wechat_qr_url'] = $wechatPath;
        } elseif ($request->filled('wechat_qr_media_id')) {
            // Handle media file selection
            $mediaId = $request->input('wechat_qr_media_id');
            $mediaFile = \App\Models\MediaFile::find($mediaId);
            if ($mediaFile) {
                $data['wechat_qr_url'] = $mediaFile->url;
                $data['wechat_qr_media_id'] = $mediaId;
            }
        }

        // Handle Alipay QR code - file upload or media selection
        if ($request->hasFile('alipay_qr_file')) {
            $alipayFile = $request->file('alipay_qr_file');
            $alipayPath = $alipayFile->store('suppliers/qrcodes', 'public');
            $data['alipay_qr_url'] = $alipayPath;
        } elseif ($request->filled('alipay_qr_media_id')) {
            // Handle media file selection
            $mediaId = $request->input('alipay_qr_media_id');
            $mediaFile = \App\Models\MediaFile::find($mediaId);
            if ($mediaFile) {
                $data['alipay_qr_url'] = $mediaFile->url;
                $data['alipay_qr_media_id'] = $mediaId;
            }
        }

        $supplier = Supplier::create($data);

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
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $data = $request->except(['wechat_qr_file', 'alipay_qr_file', 'wechat_qr_media_id', 'alipay_qr_media_id']);

        // Handle WeChat QR code - file upload or media selection
        if ($request->hasFile('wechat_qr_file')) {
            // Delete old file if exists
            if ($supplier->wechat_qr_url) {
                Storage::delete($supplier->wechat_qr_url);
            }

            $wechatFile = $request->file('wechat_qr_file');
            $wechatPath = $wechatFile->store('suppliers/qrcodes', 'public');
            $data['wechat_qr_url'] = $wechatPath;
            $data['wechat_qr_media_id'] = null;
        } elseif ($request->filled('wechat_qr_media_id')) {
            // Handle media file selection
            $mediaId = $request->input('wechat_qr_media_id');
            $mediaFile = \App\Models\MediaFile::find($mediaId);
            if ($mediaFile) {
                $data['wechat_qr_url'] = $mediaFile->url;
                $data['wechat_qr_media_id'] = $mediaId;
            }
        }

        // Handle Alipay QR code - file upload or media selection
        if ($request->hasFile('alipay_qr_file')) {
            // Delete old file if exists
            if ($supplier->alipay_qr_url) {
                Storage::delete($supplier->alipay_qr_url);
            }

            $alipayFile = $request->file('alipay_qr_file');
            $alipayPath = $alipayFile->store('suppliers/qrcodes', 'public');
            $data['alipay_qr_url'] = $alipayPath;
            $data['alipay_qr_media_id'] = null;
        } elseif ($request->filled('alipay_qr_media_id')) {
            // Handle media file selection
            $mediaId = $request->input('alipay_qr_media_id');
            $mediaFile = \App\Models\MediaFile::find($mediaId);
            if ($mediaFile) {
                $data['alipay_qr_url'] = $mediaFile->url;
                $data['alipay_qr_media_id'] = $mediaId;
            }
        }

        $supplier->update($data);

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

    /**
     * Remove WeChat QR code for the specified supplier.
     */
    public function removeWechatQr(Supplier $supplier)
    {
        if ($supplier->wechat_qr_url) {
            Storage::delete($supplier->wechat_qr_url);
            $supplier->update(['wechat_qr_url' => null]);
        }

        return response()->json(['message' => 'WeChat QR code removed successfully']);
    }

    /**
     * Remove Alipay QR code for the specified supplier.
     */
    public function removeAlipayQr(Supplier $supplier)
    {
        if ($supplier->alipay_qr_url) {
            Storage::delete($supplier->alipay_qr_url);
            $supplier->update(['alipay_qr_url' => null]);
        }

        return response()->json(['message' => 'Alipay QR code removed successfully']);
    }

    /**
     * Get the count of products for the specified supplier.
     */
    public function productsCount(Supplier $supplier)
    {
        try {
            // Count products associated with this supplier through the pivot table
            $productCount = $supplier->products()->count();

            return response()->json([
                'count' => $productCount,
                'supplier_id' => $supplier->id,
                'supplier_name' => $supplier->name
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch product count',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the products for the specified supplier.
     */
    public function products(Supplier $supplier)
    {
        // Add debugging
        \Log::info('SupplierController::products called');
        \Log::info('Supplier ID:', ['id' => $supplier->id]);
        \Log::info('Current user:', ['user' => auth()->user()]);
        \Log::info('User role:', ['role' => auth()->user()?->role]);

        try {
            // Get products associated with this supplier through the pivot table
            $products = $supplier->products()
                ->withPivot('supplier_product_urls')
                ->get()
                ->map(function ($product) {
                    $productData = $product->toArray();
                    $productData['pivot']['supplier_product_urls'] = json_decode($productData['pivot']['supplier_product_urls'], true) ?? [];
                    return $productData;
                });

            \Log::info('Products found:', ['count' => $products->count()]);

            return response()->json([
                'products' => $products,
                'supplier' => $supplier->only(['id', 'name', 'shop_name', 'email']),
                'count' => $products->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('SupplierController::products error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to fetch supplier products',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}