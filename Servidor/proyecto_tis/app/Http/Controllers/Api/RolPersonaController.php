<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RolPersona;
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
}
