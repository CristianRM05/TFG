<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shelf extends Model
{
    use HasFactory;

    protected $table = 'shelves';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'location',
        'max_capacity',
    ];

    /**
     * Attribute casts.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'max_capacity' => 'float', // podría ser volumen, peso o unidades según la gestión
    ];

    /**
     * Relationships (optional example, adjust as needed)
     */
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
}
