<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'total_amount', 'status', 'payment_method', 'shipping_address', 'stripe_session_id', 'ref', 'assigned_at'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            do {
                $ref = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
            } while (self::where('ref', $ref)->exists());

            $order->ref = $ref;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
