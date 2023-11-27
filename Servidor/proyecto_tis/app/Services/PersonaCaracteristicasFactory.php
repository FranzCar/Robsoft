<?php

namespace App\Services;

use App\Handlers\EstudianteCaracteristicasHandler;
use App\Handlers\CoachCaracteristicasHandler;

class PersonaCaracteristicasFactory {
    public static function getHandler($tipoPersona) {
        switch ($tipoPersona) {
            case 'estudiante':
                return new EstudianteCaracteristicasHandler();
            case 'coach':
                return new CoachCaracteristicasHandler();
            // Más casos según sea necesario
        }
    }
}