<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ubicacion;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
    public function listaUbicaciones()
    {
        $ubicacion = Ubicacion::all();
    return $ubicacion;
    }  
}
