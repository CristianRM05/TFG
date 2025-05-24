<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketLinkMail extends Mailable
{
    public $ticket;
    public $url;

    public function __construct($ticket, $url)
    {
        $this->ticket = $ticket;
        $this->url = $url;
    }

    public function build()
    {
        return $this->subject('Tu ticket en Swapify')
            ->view('emails.ticket-link');
    }
}

