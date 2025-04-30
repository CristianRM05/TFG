<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Coupon extends Model
{
    protected $fillable = ['code', 'discount', 'expires_at'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('status', 'used_at')
            ->withTimestamps();
    }

}
