<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Disponibilidad;
use Illuminate\Support\Facades\DB;

class DisponibilidadController extends Controller
{
    public function obtenerHorarios(Request $request)
    {
        $idUbicacion = $request->input('id_ubicacion');
        $fechaEtapa = $request->input('fecha_etapa');

        $horariosDisponibles = Disponibilidad::where('id_ubicacion', $idUbicacion)
                                    ->where('fecha_ocupacion', $fechaEtapa)
                                    ->get();

        return response()->json($horariosDisponibles);
    }
}