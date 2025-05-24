<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Enums\categoryProducts;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Stock;

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
        'discount_percent',
        'image_url',
        'categoria',
        'shelf_id',
        'is_visible',

    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'discount_percent' => 'float',
        'categoria' => categoryProducts::class,
    ];


       public function stock(): HasOne
{
    return $this->hasOne(Stock::class, 'product_id');
}

    /**
     * Stock en múltiples ubicaciones (hasMany).
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class, 'product_id');
    }

    public function shelf()
{
    return $this->belongsTo(Shelf::class)->withDefault();
}

public function siblingProducts()
{
    return $this->where('num_reference', $this->num_reference)
               ->where('id', '!=', $this->id);
}



public function getFinalPriceAttribute()
{
    return $this->discount_percent
        ? $this->price - ($this->price * $this->discount_percent / 100)
        : $this->price;
}



}
