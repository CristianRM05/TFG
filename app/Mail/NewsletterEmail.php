<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $customSubject,
        public string $content
    ) {}

    public function build()
    {
        return $this
            ->subject($this->customSubject)
            ->view('emails.newsletter')
            ->with(['content' => $this->content]);
    }
}
