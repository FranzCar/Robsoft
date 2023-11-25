<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoEvento;
use Illuminate\Http\Request;

class TipoEventoController extends Controller
{
    public function listaTipoEventos()
    {
        $tipos = TipoEvento::all();
    return $tipos;
    }  
}
