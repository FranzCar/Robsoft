<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Evento;

class EventoNotificacion  extends Notification
{
    use Queueable;

    protected $evento;
    protected $tipo;

    public function __construct(Evento $evento, $tipo)
    {
        $this->evento = $evento;
        $this->tipo = $tipo;
    }
    
    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        if ($this->tipo == 'eliminado') {
            return (new MailMessage)
                ->greeting('Hola ' . $notifiable->nombre)
                ->line('Lamentamos informarte que el evento "' . $this->evento->TITULO . '" programado para el ' . $this->evento->FECHA_INICIO . ' ha sido cancelado.')
                ->line('Por favor, revisa la página ICPC UMSS para más detalles.')
                ->action('Visitar ICPC UMSS', url('/'));
        } elseif ($this->tipo == 'modificado') {
            return (new MailMessage)
                ->greeting('Hola ' . $notifiable->nombre)
                ->line('Te informamos que ha habido cambios en el evento "' . $this->evento->TITULO . '", programado para el ' . $this->evento->FECHA_INICIO . '.')
                ->line('Por favor, revisa la página ICPC UMSS para más detalles.')
                ->action('Visitar ICPC UMSS', url('/'));
        }
    }
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    /*public function toMail($notifiable)
    {
        $code = random_int(100000, 999999);
    return (new MailMessage)
        ->line('La introducción a la notificación.')
        ->line('Código de verificación: ' . $code)
        ->action('Verificar', url('/'))
        ->line('¡Gracias por utilizar nuestra aplicación!');
    }
    */

    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
