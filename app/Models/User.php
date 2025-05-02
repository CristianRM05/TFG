<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\StatusTruck;
use App\Enums\RolesEmployee;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Cart;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'phone',
        'location',
        'role',
        'avatar',
        'external_id',
        'external_auth',
        'banned_at'


    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

 
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => RolesEmployee::class,
        'banned_at' => 'datetime'

    ];

    protected static function boot()
    {
        parent::boot();
    }
    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class)->where('status', 'active');
    }

    public function ban()
    {
        $this->update(['banned_at' => now()]);
        return $this;
    }

    public function unban()
    {
        $this->update(['banned_at' => null]);
        return $this;
    }

    public function isBanned(): bool
    {
        return !is_null($this->banned_at);
    }
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
    public function coupons()
    {
        return $this->belongsToMany(Coupon::class)
            ->withPivot('status', 'used_at')
            ->withTimestamps();
    }
}
