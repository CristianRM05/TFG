<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_date',
        'customer_id',
        'status',
        'scheduled_delivery_date',
        'truck_id',
        'delivery_person_id',
        'route_id',
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'order_date' => 'datetime',
        'scheduled_delivery_date' => 'datetime',
        'status' => OrderStatus::class,
    ];

    /**
     * Relationships
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function truck()
    {
        return $this->belongsTo(Truck::class, 'truck_id');
    }

    public function deliveryPerson()
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    public function route()
    {
        return $this->belongsTo(Route::class, 'route_id');
    }
}
