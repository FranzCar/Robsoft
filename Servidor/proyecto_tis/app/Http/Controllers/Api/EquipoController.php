<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipo;
use App\Models\RolPersona;
use App\Models\RolPersonaEquipo;

use Illuminate\Support\Facades\DB;

class EquipoController extends Controller {
    public function store(Request $request) {
        return DB::transaction(function() use ($request) {
            try {
                // Crear equipo
                $equipo = new Equipo();
                $equipo->nombre_equipo = $request->nombre_equipo;
                $equipo->responsable = $request->responsable;

                $equipo->save();
                
                // Asociar participantes al equipo
            if ($request->has('participantes')) {
                foreach ($request->participantes as $idParticipante) {
                    // Obtener id_rol_persona para cada participante
                    $participanteRolPersona = RolPersona::where('id_persona', $idParticipante)
                                                        ->where('id_roles', 6) // Asume que 6 es el ID del rol de participante
                                                        ->firstOrFail();

                    RolPersonaEquipo::create([
                        'id_rol_persona' => $participanteRolPersona->id_rol_persona,
                        'id_equipo' => $equipo->id_equipo
                    ]);
                }
            }
                // Asociar coach al equipo
                if ($request->has('coach')) {
                    RolPersonaEquipo::create([
                        'id_rol_persona' => $request->coach,
                        'id_equipo' => $equipo->id_equipo
                    ]);
                }
    
                return response()->json([
                    'message' => 'Equipo y participantes guardados con éxito',
                    'id_equipo' => $equipo->id_equipo
                ]);
            } catch (\Exception $e) {
                \Log::error('Error al guardar equipo: ' . $e->getMessage());
                DB::rollBack();
                return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el equipo', 'error_detail' => $e->getMessage()], 500);
            }
        });
    }
        public function listaEquipos()
        {
            $equipo = Equipo::all();
            return $equipo;
        }

}

