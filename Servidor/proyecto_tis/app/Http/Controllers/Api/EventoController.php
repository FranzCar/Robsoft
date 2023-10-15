<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class EventoController extends Controller
{
    
    public function index()
    {
        $eventos = Evento::all();
        return $eventos;
    }

    
    public function store(Request $request)
    {
        // Reglas de validación
        $rules = [
            'TITULO' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'UBICACION' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'DESCRIPCION' => 'required|string|min:5|max:300|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'ORGANIZADOR' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'PATROCINADOR' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
        // Puedes agregar las demás reglas de los otros campos aquí si es necesario
        ];

        // Mensajes de error personalizados en español
        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute debe tener como máximo :max caracteres.',
            'regex' => 'El campo :attribute contiene caracteres no permitidos.',
        ];

        // Validar los datos de entrada
        $request->validate($rules, $messages);

        // Crear el evento
        $evento = new Evento();
        $evento->TITULO = $request->TITULO;
        $evento->TIPO_EVENTO = $request->TIPO_EVENTO;
        $evento->ESTADO = $request->ESTADO;
        $evento->FECHA = $request->FECHA;
        $evento->HORA = $request->HORA;
        $evento->UBICACION = $request->UBICACION;
        $evento->DESCRIPCION = $request->DESCRIPCION;
        $evento->ORGANIZADOR = $request->ORGANIZADOR;
        $evento->PATROCINADOR = $request->PATROCINADOR;

        $evento->save();

        return response()->json(['message' => 'Evento creado con éxito']);
    }

   
    public function show($id)
    {
        $evento = Evento::find($id);
        return $evento;
    }

    
    public function update(Request $request, $id)
    {
        $evento = Evento::findorFail($request->$id);
        $evento->TITULO = $request->TITULO;
        $evento->DESCRIPCION = $request->DESCRIPCION;

        $evento->save();
        return $evento;
    }

    
    public function destroy($id)
    {
        $evento = Evento::destroy($id);
        return $evento;
    }

    public function getEventosNoMostrar() {
        $eventos = DB::select('CALL EventosNoMostrar()');
        return response()->json($eventos);
    }

    public function getEventosMostrar() {
        $eventos = DB::select('CALL EventosMostrar()');
        return response()->json($eventos);
    }
    public function QuitarEvento($id)
{

    $evento = Evento::findOrFail($id);
    $evento->MOSTRAR = false;
    $evento->save();

    return response()->json(['message' => 'Atributo MOSTRAR actualizado a FALSE con éxito.'], 200);
}
}
