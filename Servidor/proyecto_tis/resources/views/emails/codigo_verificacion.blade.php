@component('mail::message')
# Código de Verificación

Tu código de verificación es: {{ $codigo }}

Este código expirará en 2 minutos.

Gracias,<br>
{{ config('app.name') }}
@endcomponent

