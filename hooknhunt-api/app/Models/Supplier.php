<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $guarded = ['id'];

    // Future Relation: Shipments
    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}