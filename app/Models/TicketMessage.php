<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketMessage extends Model
{
      use HasFactory;

    protected $fillable = ['ticket_id', 'sender_type', 'sender_id', 'message'];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
