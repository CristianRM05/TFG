<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\MovementType;

class WarehouseMovement extends Model
{
    use HasFactory;

    protected $table = 'warehouse_movements';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'movement_type', 
        'quantity',
        'movement_date',
        'order_id', // optional, if associated to an order
        'shelf_id', // optional: shelf from/to
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'movement_type' => MovementType::class,
        'quantity' => 'float',
        'movement_date' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
