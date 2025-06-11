<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Evento;
use App\Models\Etapa;
use App\Models\HorarioEtapa;
use Illuminate\Support\Facades\DB;
use App\Services\EstadoEventoService;

class EtapaController extends Controller
{
    protected $estadoEventoService;

    // Inyectar el servicio en el constructor
    public function __construct(EstadoEventoService $estadoEventoService)
    {
        $this->estadoEventoService = $estadoEventoService;
    }

    public function guardarEtapa(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $evento = Evento::findOrFail($id);

            // Crear la etapa
            $etapa = new Etapa;
            $etapa->nombre_etapa = $request->nombre_etapa;
            $etapa->fecha_hora_inicio = $request->fecha_hora_inicio;
            $etapa->fecha_hora_fin= $request->fecha_hora_fin;
            $etapa->modalidad_ubicacion = $request->modalidad_ubicacion;
            $etapa->id_evento = $id; // Usar el $id pasado al método directamente
            $etapa->url_etapa = $request->url_etapa;
            $etapa->save();

            // Asociar ubicación con la etapa
            DB::table('UBICACION_ETAPA')->insert([
                'id_ubicacion' => $request->id_ubicacion,
                'id_etapa' => $etapa->id_etapa,
            ]);

            DB::commit();

            // actualizar estado del evento
            $this->estadoEventoService->actualizarEstadoAListo($id);

            return response()->json(['message' => 'Etapa guardada con éxito']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar la etapa', 'error' => $e->getMessage()], 500);
        }
    }
}
