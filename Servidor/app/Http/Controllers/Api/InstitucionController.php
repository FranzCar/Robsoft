<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Institucion;

class InstitucionController extends Controller
{
    public function listaInstitucion()
        {
            $institucion = Institucion::all();
        return $institucion;
        }  
}
