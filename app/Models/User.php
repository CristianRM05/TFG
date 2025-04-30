<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\StatusTruck;
use App\Enums\RolesEmployee;
use Illuminate\Database\Eloquent\Relations\HasOne;
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     * The attributes that are mass assignable.
     *
     * @throws \Illuminate\Database\QueryException
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'dni',
        'email',
        'password',
        'phone',
        'location',
        'role',
        'avatar',
        'external_id',
        'external_auth',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => RolesEmployee::class,
    ];

    protected static function boot()
{
    parent::boot();


}
public function cart(): HasOne
    {
        return $this->hasOne(Cart::class)->where('status', 'active');
    }


}
