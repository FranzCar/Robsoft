<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Services\PersonaCaracteristicasFactory;
use Illuminate\Support\Facades\DB;

class PersonaController extends Controller
{
    protected $registroEstudianteService;

    public function __construct(RegistroEstudianteService $registroEstudianteService)
    {
        $this->registroEstudianteService = $registroEstudianteService;
    }

    public function listParticipantes(Request $request) {
        $participantes = Persona::select('id_persona', 'nombre', 'ci','correo_electronico')
                        ->whereHas('RolPersona', function($query) {
                         $query->where('id_roles', 6);
                        })
                         ->get();

        return $participantes;           
    }
}

