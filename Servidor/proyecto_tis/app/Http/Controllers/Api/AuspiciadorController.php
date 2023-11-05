<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Auspiciador;
use Illuminate\Support\Facades\DB;

class AuspiciadorController extends Controller
{
    public function listaAuspiciadores()
        {
            $auspiciador = Auspiciador::all();
            return $auspiciador;
        }
}
