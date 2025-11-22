<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
