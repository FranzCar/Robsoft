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
            'talla_polera' => 2, // id de la característica 'talla polera'
            'codigoSIS' => 3, // id de la característica 'codigoSIS'
            'fecha_nacimiento' => 4, // id de la característica 'fecha_nacimiento'
            'foto' => 5, // id de la característica 'foto'
            'certificado_estudiante' => 6, // id de la característica 'certificado_estudiante'
        ];

        // Guardar características de texto
        foreach(['semestre', 'talla_polera', 'codigoSIS'] as $caracteristica) {
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
        
    }
    public function actualizarCaracteristicas($persona, $request) {
        $caracteristicasEstudiante = [
            'semestre' => 1,
            'talla_polera' => 2,
            'codigoSIS' => 3,
            'fecha_nacimiento' => 4,
            'foto' => 5,
            'certificado_estudiante' => 6,
        ];
    
        // Actualizar características de texto
        foreach (['semestre', 'talla_polera', 'codigoSIS'] as $caracteristica) {
            $valor = $request->input($caracteristica);
            if ($valor !== null) {
                // Intenta encontrar el registro existente
                $registroExistente = CaracteristicaTextoPersona::where('id_caract_per', $caracteristicasEstudiante[$caracteristica])
                                                               ->where('id_persona', $persona->id_persona)
                                                               ->first();
    
                if ($registroExistente) {
                    // Actualiza el registro existente
                    $registroExistente->valor_texto_persona = $valor;
                    $registroExistente->save();
                } else {
                    // Crea un nuevo registro
                    CaracteristicaTextoPersona::create([
                        'valor_texto_persona' => $valor,
                        'id_caract_per' => $caracteristicasEstudiante[$caracteristica],
                        'id_persona' => $persona->id_persona,
                    ]);
                }
            }
        }
    
        // Actualizar la fecha de nacimiento
        $valorFechaNacimiento = $request->input('fecha_nacimiento');
        if ($valorFechaNacimiento !== null) {
            CaracteristicaFechaPersona::updateOrCreate(
                [
                    'id_caract_per' => $caracteristicasEstudiante['fecha_nacimiento'],
                    'id_persona' => $persona->id_persona,
                ],
                ['valor_fecha_persona' => $valorFechaNacimiento]
          );
        }
    
        // Actualizar características de longtext
        foreach(['foto', 'certificado_estudiante'] as $caracteristica) {
            $valor = $request->input($caracteristica);
            if ($valor !== null) {
                CaracteristicaLongtextPersona::updateOrCreate(
                    [
                        'id_caract_per' => $caracteristicasEstudiante[$caracteristica],
                        'id_persona' => $persona->id_persona,
                    ],
                    ['valor_longtext_persona' => $valor]
                );
            }
        }
    }
}