<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Models\Coach;
use Illuminate\Support\Facades\DB;

class CoachController extends Controller
{
    
    public function store(Request $request)
    {
        return DB::transaction(function() use ($request) {
            // Primero, guarda la información en la tabla PERSONA
            $persona = new Persona();
            $persona->nombre = $request->nombre;
            $persona->correo_electronico = $request->correo_electronico;
            // ... otros campos de persona
            $persona->save();

            // Ahora, utiliza el ID devuelto para guardar la información específica en COACH
            $coach = new Coach(); // O Participante si es el caso
            $coach->id_coach = $persona->id; // Asumiendo que id_coach es la FK que se relaciona con Persona
            // ... otros campos de coach
            $coach->save();

            return response()->json(['message' => 'Guardado con éxito']);
        });
    }
    public function listaCoachs()
    {
        $coach = DB::table('COACH')
                        ->join('PERSONA', 'COACH.id_persona', '=', 'PERSONA.id_persona')
                        ->select('PERSONA.ci', 'PERSONA.nombre', 'PERSONA.id_persona')
                        ->get();

        return response()->json($coach);
    }
}