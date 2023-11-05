<?php

namespace App\Services;

use App\Handlers\EstudianteCaracteristicasHandler;

class PersonaCaracteristicasFactory {
    public static function getHandler($tipoPersona) {
        switch ($tipoPersona) {
            case 'estudiante':
                return new EstudianteCaracteristicasHandler();
            case 'profesor':
                return new ProfesorCaracteristicasHandler();
            // Más casos según sea necesario
        }
    }
}