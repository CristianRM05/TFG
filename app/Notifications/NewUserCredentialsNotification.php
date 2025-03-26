<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewUserCredentialsNotification extends Notification
{
    use Queueable;

    public function __construct(public string $password) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Tus credenciales de acceso')
            ->greeting('Hola ' . $notifiable->name)
            ->line('Tu cuenta ha sido creada correctamente.')
            ->line('Correo: ' . $notifiable->email)
            ->line('Contraseña temporal: ' . $this->password)
            ->line('Por seguridad, cambiala al iniciar sesión.')
            ->action('Iniciar sesión', url('/login'));
    }
}
