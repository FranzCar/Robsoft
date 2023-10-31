<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Models\Participante;
use Illuminate\Support\Facades\DB;

class ParticipanteController extends Controller
{
    public function store(Request $request)
    {
        return DB::transaction(function() use ($request) {
            // Primero, guarda la información en la tabla PERSONA
            $persona = new Persona();
            $persona->nombre = $request->nombre;
            $persona->correo_electronico = $request->correo_electronico;
            $persona->ci = $request->ci;
            $persona->telefono = $request->telefono;
            $persona->genero = $request->genero;
            $persona->rol_persona = 1;
            $persona->save();

            // Ahora, utiliza el ID devuelto para guardar la información específica en Participante
            $participante = new Participante();
            $participante->id_persona = $persona->id;
            $participante->fechaNacimiento = $request->fechaNacimiento;
            $participante->talla_polera = $request->talla_polera;
            $participante->foto = $request->foto;
            $participante->certificado = $request->certificado;
            $participante->codigoSIS = $request->codigoSIS;

            $participante->save();

            return response()->json(['message' => 'Guardado con éxito']);
        });
    }
    public function listParticipantes()
    {
        // Unimos las tablas PERSONA y PARTICIPANTE basados en el id_persona
        // y seleccionamos solamente las columnas CI y nombre de la tabla PERSONA
        $participantes = DB::table('PARTICIPANTE')
                        ->join('PERSONA', 'PARTICIPANTE.id_persona', '=', 'PERSONA.id_persona')
                        ->select('PERSONA.ci', 'PERSONA.nombre','PERSONA.id_persona')
                        ->get();

        return response()->json($participantes);
    }
}
