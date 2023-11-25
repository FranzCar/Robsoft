<?php

namespace App\Services;

use App\Models\Evento;
use App\Models\CaracteristicaTextoEvento;
use App\Models\CaracteristicaLongtextEvento;
use App\Models\CaracteristicaIntEvento;
use App\Models\CaracteristicaFechaEvento;
use App\Models\Etapa;
use App\Models\Inscripcion;
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

    public function actualizarEstadoAInscrito($idEvento)
    {
        DB::transaction(function () use ($idEvento) {
            $evento = Evento::findOrFail($idEvento);

            // Verificar si ya hay inscripciones para este evento
            $tieneInscripciones = Inscripcion::where('id_evento', $idEvento)->exists();

            // Si el evento está en estado "Listo" y tiene inscripciones, actualizar a "Inscrito"
            if ($evento->ESTADO == 'Listo' && $tieneInscripciones) {
                $evento->ESTADO = 'Inscrito';
                $evento->save();
            }
        });
    }
}
