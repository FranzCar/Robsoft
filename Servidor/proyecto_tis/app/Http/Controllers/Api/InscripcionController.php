<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inscripcion;
use App\Models\RolPersona;
use App\Models\RolPersonaEquipo;
use Illuminate\Support\Facades\DB;
use App\Services\EstadoEventoService;

class InscripcionController extends Controller
{
    protected $estadoEventoService;

    public function __construct(EstadoEventoService $estadoEventoService)
    {
        $this->estadoEventoService = $estadoEventoService;
    }

    public function inscribirEstudiante(Request $request) {
        $request->validate([
            'id_evento' => 'required',
            'id_persona' => 'required',
        ]);

        $idEvento = $request->id_evento;
        $idPersona = $request->id_persona;

        DB::beginTransaction();

        try {
            // Buscar el id_rol_persona correspondiente
            $rolPersona = RolPersona::where('id_persona', $idPersona)
                                    ->where('id_roles', 6) // 6 representa el rol de participante
                                    ->first();

            if (!$rolPersona) {
                return response()->json(['message' => 'Rol de persona no encontrado'], 404);
            }

            // Crear la inscripción
            $inscripcion = new Inscripcion();
            $inscripcion->id_rol_persona = $rolPersona->id_rol_persona;
            $inscripcion->id_evento = $idEvento;
            
            $inscripcion->save();

            DB::commit();
            
            // Después de guardar la inscripción con éxito
            $this->estadoEventoService->actualizarEstadoAInscrito($idEvento);

            return response()->json(['message' => 'Estudiante inscrito con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al inscribir el estudiante', 'error' => $e->getMessage()], 500);
        }
    }
    public function inscribirEquipo(Request $request) {
        $request->validate([
            'id_evento' => 'required',
            'id_equipo' => 'required',
        ]);

        $idEvento = $request->id_evento;
        $idEquipo = $request->id_equipo;

        DB::beginTransaction();

        try {
            // Crear la inscripción
            $inscripcion = new Inscripcion();
            $inscripcion->id_equipo = $idEquipo;
            $inscripcion->id_evento = $idEvento;
            
            $inscripcion->save();

            DB::commit();
            
            // Después de guardar la inscripción con éxito
            $this->estadoEventoService->actualizarEstadoAInscrito($idEvento);

            return response()->json(['message' => 'Equipo inscrito con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al inscribir el Equipo', 'error' => $e->getMessage()], 500);
        }
    }
    public function listaInscritosEvento($idEvento)
{
    try {
        // Obtener las inscripciones para el evento
        $inscripciones = Inscripcion::where('id_evento', $idEvento)->get();

        $inscritos = [];

        foreach ($inscripciones as $inscripcion) {
            // Para inscripciones individuales
            if ($inscripcion->id_rol_persona) {
                $rolPersona = RolPersona::with('persona')
                                        ->where('id_rol_persona', $inscripcion->id_rol_persona)
                                        ->where('id_roles', 6) // Filtrar solo participantes
                                        ->first();
                if ($rolPersona && $rolPersona->persona) {
                    $inscritos[] = $rolPersona->persona;
                }
            }

            // Para inscripciones de equipos
            if ($inscripcion->id_equipo) {
                $miembrosEquipo = RolPersona::with('persona')
                                            ->whereHas('rolPersonaEquipo', function ($query) use ($inscripcion) {
                                                $query->where('id_equipo', $inscripcion->id_equipo);
                                            })
                                            ->where('id_roles', 6) // Filtrar solo participantes
                                            ->get();

                foreach ($miembrosEquipo as $miembro) {
                    if ($miembro->persona) {
                        $inscritos[] = $miembro->persona;
                    }
                }
            }
        }

        // Eliminar duplicados
        $inscritos = array_unique($inscritos, SORT_REGULAR);

        return response()->json($inscritos);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al obtener la lista de inscritos', 'error' => $e->getMessage()], 500);
    }
}

}
