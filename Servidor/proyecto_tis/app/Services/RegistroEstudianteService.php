<?php

namespace App\Services;

use App\Models\Persona;
use Illuminate\Support\Facades\DB;
use App\Services\PersonaCaracteristicasFactory;

class RegistroEstudianteService
{
    public function registrarEstudiante($datos) {
        DB::beginTransaction();
        try {
            $persona = new Persona();
            // Asignar los valores a los atributos del modelo
            $persona->nombre = $datos['nombre'];
            $persona->correo_electronico = $datos['correo_electronico'];
            $persona->telefono = $datos['telefono'];
            $persona->ci = $datos['ci'];
            $persona->genero = $datos['genero'];
            $persona->id_tipo_per = 1; // Asumiendo que 1 es el tipo de estudiante
            $persona->id_institucion = $datos['id_institucion'];
            $persona->save();

            $handler = PersonaCaracteristicasFactory::getHandler('estudiante');
            $handler->guardarCaracteristicas($persona, $datos);

            DB::table('ROL_PERSONA')->insert([
                'id_persona' => $persona->id_persona,
                'id_roles' => 6, // 6 es de participante
            ]);

            DB::commit();
            return $persona;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
