<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipo;
use Illuminate\Support\Facades\DB;

class EquipoController extends Controller {
        public function store (Request $request) {
            return DB::transaction(function() use ($request) {
                try {
                    $equipo = new Equipo();
                    $equipo->nombre_equipo = $request->nombre_equipo;
                    $equipo->id_coach_persona = $request->id_coach_persona;
        
                    $equipo->save();
                    
                    // Asociar participantes al equipo
                    if ($request->has('participantes')) {
                        foreach ($request->participantes as $id_participante) {
                            DB::table('participante_equipo')->insert([
                                'id_participante' => $id_participante,
                                'id_equipo' => $equipo->id_equipo
                            ]);
                        }
                    }

            return response()->json(['message' => 'Equipo y participantes guardados con éxito']);
                } catch (\Exception $e) {
                    // Registrar el mensaje de error en el log
                    \Log::error('Error al guardar equipo: ' . $e->getMessage());
            
                    // Devolver el mensaje de error detallado al cliente (solo en ambiente de desarrollo)
                    if (app()->environment('local')) {
                        return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el equipo', 'error_detail' => $e->getMessage()], 500);
                    } else {
                        return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el equipo'], 500);
                    }
                }
            });
        }
        public function listaEquipos()
        {
            $equipo = Equipo::all();
            return $equipo;
        }

}

