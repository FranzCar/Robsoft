<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evento;
use App\Models\Etapa;
use App\Models\HorarioEtapa;
use Illuminate\Support\Facades\DB;

class EtapaController extends Controller
{
    public function guardarEtapa(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $evento = Evento::findOrFail($id);

            // Crear la etapa
            $etapa = new Etapa;
            $etapa->nombre_etapa = $request->nombre_etapa;
            $etapa->fecha_etapa = $request->fecha_etapa;
            $etapa->modalidad_ubicacion = $request->modalidad_ubicacion;
            $etapa->id_evento = $id; // Usar el $id pasado al método directamente
            $etapa->save();

            // Asociar horarios con la etapa
            foreach ($request->id_horario as $idHorario) {
                $horarioEtapa = new HorarioEtapa;
                $horarioEtapa->id_horario = $idHorario;
                $horarioEtapa->id_etapa = $etapa->id_etapa;
                $horarioEtapa->save();
                
                // Registrar en Disponibilidad
                DB::table('DISPONIBILIDAD')->insert([
                    'id_ubicacion' => $request->id_ubicacion,
                    'id_horario' => $idHorario,
                    'fecha_ocupacion' => $request->fecha_etapa,
                    'Ocupacion' => "Ocupado",
            ]);

            }

            // Asociar ubicación con la etapa
            DB::table('UBICACION_ETAPA')->insert([
                'id_ubicacion' => $request->id_ubicacion,
                'id_etapa' => $etapa->id_etapa,
            ]);

            

            DB::commit();

            return response()->json(['message' => 'Etapa guardada con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar la etapa', 'error' => $e->getMessage()], 500);
        }
    }
}
