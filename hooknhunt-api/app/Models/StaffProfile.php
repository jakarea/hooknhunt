<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffProfile extends Model
{
    use SoftDeletes;

    // Mass assignment
    protected $fillable = [
        'user_id',
        'address',
        'division',
        'district',
        'thana',
        'department_id',
        'designation',
        'joining_date',
        'base_salary',
        'house_rent',
        'medical_allowance',
        'conveyance_allowance',
        'overtime_hourly_rate',
        'office_email',
        'office_email_password',
        'whatsapp_number',
        'dob',
        'gender',
        'profile_photo_id',
    ];

    // Date casting
    protected $casts = [
        'dob' => 'date',
        'joining_date' => 'date',
    ];

    // Append accessors to JSON
    protected $appends = ['department_name'];

    // রিলেশনশিপ: প্রোফাইলের মালিক কে?
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // রিলেশনশিপ: প্রোফাইলটি কোন ডিপার্টমেন্টের?
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Accessor for department name
    public function getDepartmentNameAttribute()
    {
        return $this->department?->name;
    }

    // মিডিয়া রিলেশন (যদি ফটো থাকে)
    public function photo()
    {
        return $this->belongsTo(MediaFile::class, 'profile_photo_id');
    }
}
