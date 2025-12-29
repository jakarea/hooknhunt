<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Photo relation (Media)
    public function photo()
    {
        return $this->belongsTo(MediaFile::class, 'profile_photo_id');
    }
}