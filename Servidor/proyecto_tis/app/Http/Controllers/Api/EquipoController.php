<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipo;

class EquipoController extends Controller {
        public function store (Request $request) {
            return DB::transaction(function() use ($request) {
                try {
                    $equipo = new Equipo();
                    $equipo->nombre_equipo = $request->nombre_equipo;
                    $equipo->cantidad_integrantes = $request->cantidad_integrantes;
                    $equipo->id_coach = $request->id_coach;
        
                    $equipo->save();
                    
                    // Asociar participantes al equipo
                    if ($request->has('participantes')) {
                        foreach ($request->participantes as $id_participante) {
                            DB::table('participante_equipo')->insert([
                                'id_participante' => $id_participante,
                                'id_equipo' => $equipo->id_equipo // Asumiendo que tu columna auto-incremental se llama id_equipo
                            ]);
                        }
                    }

            return response()->json(['message' => 'Equipo y participantes guardados con éxito']);
                } catch (\Exception $e) {
                    // Registrar el mensaje de error en el log
                    \Log::error('Error al guardar evento: ' . $e->getMessage());
            
                    // Devolver el mensaje de error detallado al cliente (solo en ambiente de desarrollo)
                    if (app()->environment('local')) {
                        return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el evento', 'error_detail' => $e->getMessage()], 500);
                    } else {
                        return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el evento'], 500);
                    }
                }
            });
        }

}

