<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RolPersona;
use App\Models\Persona;
use Illuminate\Support\Facades\DB;

class RolPersonaController extends Controller
{
    public function listaOrganizadores()
        {
            $rolpersona = DB::select("
            SELECT RP.id_rol_persona, P.nombre, P.ci 
            FROM ROL_PERSONA as RP
            JOIN PERSONA as P ON RP.id_persona = P.id_persona
            WHERE RP.id_roles = 5
            ");
            return response()->json($rolpersona);
        }
        public function listaCoach()
        {
            $rolpersona = DB::select("
            SELECT RP.id_rol_persona, P.id_persona, P.nombre, P.ci 
            FROM ROL_PERSONA as RP
            JOIN PERSONA as P ON RP.id_persona = P.id_persona
            WHERE RP.id_roles = 4
            ");
            return response()->json($rolpersona);
        }
    public function listaFacilitadores()
        {
            $rolpersona = DB::select("
            SELECT RP.id_rol_persona, P.nombre, P.ci 
            FROM ROL_PERSONA as RP
            JOIN PERSONA as P ON RP.id_persona = P.id_persona
            WHERE RP.id_roles = 7
            ");
            return response()->json($rolpersona);
        }
    public function listaCoachInstitucion(Request $request) {
            // Obtener el id_institucion del request
            $idInstitucion = $request->id_institucion;
        
            $participantes = Persona::with(['caracteristicasTexto', 'caracteristicasFecha'])
                                ->whereHas('RolPersona', function($query) {
                                    $query->where('id_roles', 4);
                                })
                                ->when($idInstitucion, function ($query) use ($idInstitucion) {
                                    return $query->where('id_institucion', $idInstitucion);
                                })
                                ->get()
                                ->map(function ($persona) {
                                    // Buscar las características específicas
                                    $fechaNacimiento = $persona->caracteristicasFecha->firstWhere('id_caract_per', 4)->valor_fecha_persona ?? null;
        
                                    return [
                                        'id_persona' => $persona->id_persona,
                                        'nombre' => $persona->nombre,
                                        'correo_electronico' => $persona->correo_electronico,
                                        'telefono' => $persona->telefono,
                                        'ci' => $persona->ci,
                                        'genero' => $persona->genero,
                                        'id_institucion' => $persona->id_institucion,
                                    ];
                                });
        
            return $participantes;           
        }
}
