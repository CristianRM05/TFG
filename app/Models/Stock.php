<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'stocks';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'available_quantity',
        'location',
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_quantity' => 'integer',
    ];

    /**
     * Relationships
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
