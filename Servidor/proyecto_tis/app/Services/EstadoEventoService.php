<?php

namespace App\Services;

use App\Models\Evento;
use App\Models\CaracteristicaTextoEvento;
use App\Models\CaracteristicaLongtextEvento;
use App\Models\CaracteristicaIntEvento;
use App\Models\CaracteristicaFechaEvento;
use App\Models\Etapa;
use Illuminate\Support\Facades\DB;

class EstadoEventoService
{
    public function actualizarEstadoAListo($idEvento)
    {
        DB::transaction(function () use ($idEvento) {
            $evento = Evento::findOrFail($idEvento);
            
            if ($this->verificarCaracteristicasCompletas($idEvento) && $evento->ESTADO == 'En espera') {
                $evento->ESTADO = 'Listo';
                $evento->save();
            }
        });
    }

    private function verificarCaracteristicasCompletas($idEvento)
    {
        $caracteristicasCompletas = CaracteristicaTextoEvento::where('id_evento', $idEvento)->exists() ||
                                    CaracteristicaLongtextEvento::where('id_evento', $idEvento)->exists() ||
                                    CaracteristicaIntEvento::where('id_evento', $idEvento)->exists() ||
                                    CaracteristicaFechaEvento::where('id_evento', $idEvento)->exists();
        
        $tieneEtapa = Etapa::where('id_evento', $idEvento)->exists();
        
        return $caracteristicasCompletas && $tieneEtapa;
    }
}
