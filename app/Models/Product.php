<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'num_reference',
        'stock',
        'price',
        'image_url',
        'categoria',
        'shelf_id'

    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float'
    ];

    public function stocks()
{
    return $this->hasMany(Stock::class, 'product_id');
}

    public function shelf(): BelongsTo
    {
        return $this->belongsTo(Shelf::class);
    }
    public function getLocationAttribute(): ?string
    {
        return $this->shelf?->location;
    }

    
}
