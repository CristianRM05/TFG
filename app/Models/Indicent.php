<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $table = 'incidents';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'description',
        'incident_date',
        'order_id',        // optional, associated order
        'truck_id',        // optional, associated truck
        'resolved',
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'resolved' => 'boolean',
        'incident_date' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function truck()
    {
        return $this->belongsTo(Truck::class, 'truck_id');
    }
}
