<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\StatusTruck;
use App\Enums\RolesEmployee;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'number_employ',
        'name',
        'last_name',
        'dni',
        'email',
        'password',
        'phone',
        'address',
        'role',
        'photograph',
        'license',
        'driver_license',
        'license_expiration_date',
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
        'license_expiration_date' => 'date',
    ];

    protected static function boot()
{
    parent::boot();

    static::creating(function ($user) {
        // Solo si no viene seteado manualmente
        if (empty($user->number_employ)) {
            $user->number_employ = self::generateEmployeeNumber();
        }
    });
}

public static function generateEmployeeNumber()
{
    do {
        $random = strtoupper(chr(rand(65, 90))) . str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);
    } while (self::where('number_employ', $random)->exists());

    return $random;
}

}
