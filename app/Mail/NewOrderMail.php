<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewOrderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $content = 'Gracias por tu pedido. A continuación te mostramos los detalles:'
    ) {
        $this->order->loadMissing('items.product');
    }

    public function build()
    {
        return $this
            ->subject('🧾 Confirmación de tu pedido en Swapify')
            ->view('emails.newOrder')
            ->with([
                'order' => $this->order,
                'orderItems' => $this->order->items,
                'orderNumber' => $this->order->ref,
                'content' => $this->content,
            ]);
    }
}
