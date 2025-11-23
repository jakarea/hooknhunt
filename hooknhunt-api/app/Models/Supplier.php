<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Supplier extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'shop_name',
        'email',
        'shop_url',
        'wechat_id',
        'wechat_qr_url',
        'alipay_id',
        'alipay_qr_url',
        'contact_info',
    ];

    /**
     * Get the full URL for the WeChat QR code.
     */
    public function getWechatQrUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // If it's a path, generate the full URL
        return Storage::url($value);
    }

    /**
     * Get the full URL for the Alipay QR code.
     */
    public function getAlipayQrUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // If it's a path, generate the full URL
        return Storage::url($value);
    }

    /**
     * Handle file upload for WeChat QR code.
     */
    public function setWechatQrUrlAttribute($value)
    {
        if (is_file($value)) {
            // Store the file and save the path
            $path = $value->store('suppliers/qrcodes', 'public');
            $this->attributes['wechat_qr_url'] = $path;
        } else {
            // Handle direct path/string assignment
            $this->attributes['wechat_qr_url'] = $value;
        }
    }

    /**
     * Handle file upload for Alipay QR code.
     */
    public function setAlipayQrUrlAttribute($value)
    {
        if (is_file($value)) {
            // Store the file and save the path
            $path = $value->store('suppliers/qrcodes', 'public');
            $this->attributes['alipay_qr_url'] = $path;
        } else {
            // Handle direct path/string assignment
            $this->attributes['alipay_qr_url'] = $value;
        }
    }

    /**
     * Delete associated files when the supplier is deleted.
     */
    protected static function booted()
    {
        static::deleting(function ($supplier) {
            if ($supplier->wechat_qr_url) {
                Storage::delete($supplier->wechat_qr_url);
            }
            if ($supplier->alipay_qr_url) {
                Storage::delete($supplier->alipay_qr_url);
            }
        });
    }
}
