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

            //aqui registramos en ROL_PERSONA
            DB::table('ROL_PERSONA')->insert([
                'id_persona' => $persona->id_persona,
                'id_roles' => 6, //6 es de participante
            ]);

            DB::commit();
            return response()->json(['message' => 'Estudiante guardado con éxito', 'id' => $persona->id_persona]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar el estudiante', 'error' => $e->getMessage()], 500);
        }
    }

    public function guardarCoach(Request $request) {
        DB::beginTransaction();
        try {
            // Aquí asumimos que el tipo de persona es '2' para Coach
            $persona = $this->crearPersona($request, 2);
            $handler = PersonaCaracteristicasFactory::getHandler('coach');
            $handler->guardarCaracteristicas($persona, $request);

            //aqui registramos en ROL_PERSONA
            DB::table('ROL_PERSONA')->insert([
                'id_persona' => $persona->id_persona,
                'id_roles' => 4, //4 es de coach
            ]);

            DB::commit();
            return response()->json(['message' => 'Coach guardado con éxito', 'id' => $persona->id_persona]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar el Coach', 'error' => $e->getMessage()], 500);
        }
    }

    private function crearPersona($request, $tipoPersona = null) {
        $persona = new Persona();

        // Asignar los valores del request a los atributos del modelo
        $persona->nombre = $request->nombre;
        $persona->correo_electronico = $request->correo_electronico;
        $persona->telefono = $request->telefono;
        $persona->ci = $request->ci;
        $persona->genero = $request->genero;
        $persona->id_tipo_per = $tipoPersona ?? $request->id_tipo_per; // Asigna '1' por defecto si no se proporciona un valor
        $persona->id_institucion = $request->id_institucion;
        // Guardar la instancia del modelo en la base de datos
        $persona->save();

        // Retornar la instancia de la persona para su uso posterior
        return $persona;
    }

    public function listParticipantes(Request $request) {
        $participantes = Persona::with(['caracteristicasTexto', 'caracteristicasFecha'])
                            ->whereHas('RolPersona', function($query) {
                                $query->where('id_roles', 6);
                            })
                            ->get()
                            ->map(function ($persona) {
                                // Buscar las características específicas
                                $codigoSIS = $persona->caracteristicasTexto->firstWhere('id_caract_per', 3)->valor_texto_persona ?? null;
                                $fechaNacimiento = $persona->caracteristicasFecha->firstWhere('id_caract_per', 4)->valor_fecha_persona ?? null;
    
                                return [
                                    'id_persona' => $persona->id_persona,
                                    'nombre' => $persona->nombre,
                                    'correo_electronico' => $persona->correo_electronico,
                                    'telefono' => $persona->telefono,
                                    'ci' => $persona->ci,
                                    'genero' => $persona->genero,
                                    'id_institucion' => $persona->id_institucion,
                                    'codigoSIS' => $codigoSIS,
                                    'fecha_nacimiento' => $fechaNacimiento,
                                ];
                            });
    
        return $participantes;           
    }
    public function actualizarCaracteristicas(Request $request, $id) {
        $persona = Persona::findOrFail($id); // Obtiene la persona o falla si no existe
        DB::beginTransaction();
        try {
            $handler = PersonaCaracteristicasFactory::getHandler('estudiante');
            $handler->actualizarCaracteristicas($persona, $request);
    
            DB::commit();
            return response()->json(['message' => 'Características actualizadas con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar las características', 'error' => $e->getMessage()], 500);
        }
    }
}

