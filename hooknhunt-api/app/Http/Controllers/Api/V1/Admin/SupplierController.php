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
        $data = $request->except(['wechat_qr_file', 'alipay_qr_file']);

        // Handle WeChat QR code file upload
        if ($request->hasFile('wechat_qr_file')) {
            $wechatFile = $request->file('wechat_qr_file');
            $wechatPath = $wechatFile->store('suppliers/qrcodes', 'public');
            $data['wechat_qr_url'] = $wechatPath;
        }

        // Handle Alipay QR code file upload
        if ($request->hasFile('alipay_qr_file')) {
            $alipayFile = $request->file('alipay_qr_file');
            $alipayPath = $alipayFile->store('suppliers/qrcodes', 'public');
            $data['alipay_qr_url'] = $alipayPath;
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
        $data = $request->except(['wechat_qr_file', 'alipay_qr_file']);

        // Handle WeChat QR code file upload
        if ($request->hasFile('wechat_qr_file')) {
            // Delete old file if exists
            if ($supplier->wechat_qr_url) {
                Storage::delete($supplier->wechat_qr_url);
            }

            $wechatFile = $request->file('wechat_qr_file');
            $wechatPath = $wechatFile->store('suppliers/qrcodes', 'public');
            $data['wechat_qr_url'] = $wechatPath;
        }

        // Handle Alipay QR code file upload
        if ($request->hasFile('alipay_qr_file')) {
            // Delete old file if exists
            if ($supplier->alipay_qr_url) {
                Storage::delete($supplier->alipay_qr_url);
            }

            $alipayFile = $request->file('alipay_qr_file');
            $alipayPath = $alipayFile->store('suppliers/qrcodes', 'public');
            $data['alipay_qr_url'] = $alipayPath;
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
}