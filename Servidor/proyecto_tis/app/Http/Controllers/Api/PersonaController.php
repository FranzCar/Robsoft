<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Services\PersonaCaracteristicasFactory;
use Illuminate\Support\Facades\DB;

class PersonaController extends Controller
{
    public function guardarEstudiante(Request $request) {
        DB::beginTransaction();
        try {
            // Aquí asumimos que el tipo de persona es '1' para Estudiante
            $persona = $this->crearPersona($request, 1);
            $handler = PersonaCaracteristicasFactory::getHandler('estudiante');
            $handler->guardarCaracteristicas($persona, $request);

            DB::commit();
            return response()->json(['message' => 'Estudiante guardado con éxito', 'id' => $persona->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar el estudiante', 'error' => $e->getMessage()], 500);
        }
    }

    private function crearPersona($request, $tipoPersona = null) {
        $persona = new Persona();

        // Asignar los valores del request a los atributos del modelo
        // Estos campos deben ser fillable en el modelo Persona
        $persona->nombre = $request->nombre;
        $persona->correo_electronico = $request->correo_electronico;
        $persona->telefono = $request->telefono;
        $persona->ci = $request->ci;
        $persona->genero = $request->genero;
        $persona->id_tipo_persona = $tipoPersona ?? $request->id_tipo_persona; // Asigna '1' por defecto si no se proporciona un valor
        $persona->id_institucion = $request->id_institucion;
        // Guardar la instancia del modelo en la base de datos
        $persona->save();

        // Retornar la instancia de la persona para su uso posterior
        return $persona;
    }
}

