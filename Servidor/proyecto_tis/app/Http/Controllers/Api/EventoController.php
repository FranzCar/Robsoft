<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EventoController extends Controller
{
    
    public function index()
    {
        $eventos = Evento::all();
        return $eventos;
    }

    
    public function store(Request $request)
    {
        $evento = new Evento();
        $evento->TITULO = $request->TITULO;
        $evento->descripcion = $request->descripcion;
        $evento->save();
    }

   
    public function show($id)
    {
        $evento = Evento::find($id);
        return $evento;
    }

    
    public function update(Request $request, $id)
    {
        $evento = Evento::findorFail($request->id);
        $evento->titulo = $request->titulo;
        $evento->descripcion = $request->descripcion;

        $evento->save();
        return $evento;
    }

    
    public function destroy($id)
    {
        $evento = Evento::destroy($id);
        return $evento;
    }
}
