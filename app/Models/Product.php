<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'num_reference', //
        'weight', // peso en kg, por ejemplo
        'volume', // volumen en metros cúbicos o litros
        'price',  // precio unitario (opcional según gestión)
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'weight' => 'float',
        'volume' => 'float',
        'price' => 'float',
    ];
}
