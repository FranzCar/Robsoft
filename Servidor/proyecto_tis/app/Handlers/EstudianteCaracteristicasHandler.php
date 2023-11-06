<?php

namespace App\Handlers;

use App\Contracts\PersonaCaracteristicasHandler;
use App\Models\CaracteristicaFechaPersona;
use App\Models\CaracteristicaLongtextPersona;
use App\Models\CaracteristicaTextoPersona;

class EstudianteCaracteristicasHandler implements PersonaCaracteristicasHandler {
    public function guardarCaracteristicas($persona, $request) {
        $caracteristicasEstudiante = [
            'semestre' => 1, // id de la característica 'semestre'
            'talla polera' => 2, // id de la característica 'talla polera'
            'codigoSIS' => 3, // id de la característica 'codigoSIS'
            'fecha_nacimiento' => 4, // id de la característica 'fecha_nacimiento'
            'foto' => 5, // id de la característica 'foto'
            'certificado_estudiante' => 6, // id de la característica 'certificado_estudiante'
        ];

        // Guardar características de texto
        foreach(['semestre', 'talla polera', 'codigoSIS'] as $caracteristica) {
            $valor = $request->input($caracteristica); // Asegúrate de hacer validación
            if ($valor) {
                $caracteristicaTexto = new CaracteristicaTextoPersona([
                    'valor_texto_persona' => $valor,
                    'id_caract_per' => $caracteristicasEstudiante[$caracteristica],
                    'id_persona' => $persona->id_persona,
                ]);
                $caracteristicaTexto->save();
            }
        }

        // Guardar la fecha de nacimiento
        $valorFechaNacimiento = $request->input('fecha_nacimiento'); // Asegúrate de hacer validación
        if ($valorFechaNacimiento) {
            $caracteristicaFecha = new CaracteristicaFechaPersona([
                'valor_fecha_persona' => $valorFechaNacimiento,
                'id_caract_per' => $caracteristicasEstudiante['fecha_nacimiento'],
                'id_persona' => $persona->id_persona,
            ]);
            $caracteristicaFecha->save();
        }

        // Guardar características de longtext
        foreach(['foto', 'certificado_estudiante'] as $caracteristica) {
            $valor = $request->input($caracteristica); // Asegúrate de hacer validación
            if ($valor) {
                $caracteristicaLongtext = new CaracteristicaLongtextPersona([
                    'valor_longtext_persona' => $valor,
                    'id_caract_per' => $caracteristicasEstudiante[$caracteristica],
                    'id_persona' => $persona->id_persona,
                ]);
                $caracteristicaLongtext->save();
            }
        }
        
        // Realizar cualquier otra operación necesaria después de guardar los datos
    }
}

//ejemplo
class ProfesorCaracteristicasHandler implements PersonaCaracteristicasHandler {
    public function guardarCaracteristicas($persona, $request) {
        // Lógica para guardar las características de un profesor
    }
}