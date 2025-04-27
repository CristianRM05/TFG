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

    protected $fillable = [
        'id',
        'order_date',
        'user_id',
        'status',
        'scheduled_delivery_date',
        'delivery_person_id',
        'total_amount',
        'payment_method',
        'shipping_address',
        'stripe_session_id',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'scheduled_delivery_date' => 'datetime',
        'status' => "string",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
