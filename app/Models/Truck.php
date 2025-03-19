<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\TruckStatus;

class Truck extends Model
{
    use HasFactory;

    protected $table = 'trucks';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'license_plate',
        'max_capacity',
        'status',
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'max_capacity' => 'float',
        'status' => TruckStatus::class,
    ];

    /**
     * Relationships
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
