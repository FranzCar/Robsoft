<?php

namespace App\Contracts;

interface PersonaCaracteristicasHandler
{
    public function guardarCaracteristicas($persona, $request);
}
