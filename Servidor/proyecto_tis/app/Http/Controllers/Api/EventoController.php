<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;


class EventoController extends Controller
{
    
    public function index()
    {
        $eventos = Evento::all();
        return $eventos;
    }

    
    public function validarFormulario(Request $request) {
        // Reglas de validación
        $rules = [
            'TITULO' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('eventos')->where('TITULO', $value)->exists();
                    if ($exists) {
                        $fail("El evento con título '{$value}' ya existe.");
                    }
                },
            ],
            'UBICACION' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'DESCRIPCION' => 'required|string|min:5|max:300|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'ORGANIZADOR' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'PATROCINADOR' => 'sometimes|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'FECHA' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = DB::table('eventos')
                        ->where('FECHA', $value)
                        ->where('HORA', $request->HORA)
                        ->where('UBICACION', $request->UBICACION)
                        ->exists();
                    if ($exists) {
                        $fail("Ya hay un evento registrado con la misma fecha, hora y ubicación.");
                    }
                },
            ],
            'HORA' => [
                'required',
                'regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/',
                function ($attribute, $value, $fail) {
                    try {
                        $time = Carbon::createFromFormat('H:i', $value);
                        $start = Carbon::createFromFormat('H:i', '08:00');
                        $end = Carbon::createFromFormat('H:i', '20:00');
                        if ($time->lt($start) || $time->gt($end)) {
                            $fail("El campo $attribute debe estar entre 08:00 y 20:00.");
                        }
                    } catch (\Carbon\Exceptions\InvalidFormatException $e) {
                        $fail("El campo $attribute no tiene un formato válido.");
                    }
                }
            ]
        ];
        // Mensajes de error personalizados
        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute debe tener como máximo :max caracteres.',
            'regex' => 'El campo :attribute contiene caracteres no permitidos.',
        ];

        // Aplicar la validación al request
        $validator = Validator::make($request->all(), $rules, $messages);

        // Verificar si la validación falla
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Si la validación es exitosa, retornar los datos validados.
        return response()->json(['data' => $request->all()], 200);
    }

    public function guardarEvento(Request $request) {
        try {
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

            // Devolver una respuesta exitosa al cliente
            return response()->json(['status' => 'success', 'message' => 'Evento guardado con éxito']);

        } catch (\Exception $e) {
            // Si hay un error, devolver un mensaje de error al cliente
            return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el evento'], 500);
        }
    }

    public function show($id)
    {
        $evento = Evento::find($id);
        return $evento;
    }

    
    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $rules = [
            'TITULO' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'UBICACION' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'DESCRIPCION' => 'required|string|min:5|max:300|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'ORGANIZADOR' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            'PATROCINADOR' => 'sometimes|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            // Puedes agregar las demás reglas de los otros campos aquí si es necesario
        ];

        // Mensajes de error personalizados en español
        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute debe tener como máximo :max caracteres.',
            'regex' => 'El campo :attribute contiene caracteres no permitidos.',
        ];

        $request->validate($rules, $messages);

        // Buscar el evento
        $evento = Evento::findOrFail($id);

        // Actualizar los datos del evento
        $evento->TITULO = $request->TITULO;
        $evento->TIPO_EVENTO = $request->TIPO_EVENTO;
        $evento->ESTADO = $request->ESTADO;
        $evento->FECHA = $request->FECHA;
        $evento->HORA = $request->HORA;
        $evento->UBICACION = $request->UBICACION;
        $evento->DESCRIPCION = $request->DESCRIPCION;
        $evento->ORGANIZADOR = $request->ORGANIZADOR;
        $evento->PATROCINADOR = $request->PATROCINADOR;

        // Guardar el evento
        $evento->save();

        return response()->json([
            'message' => 'Evento editado con exito',
            'id' => $evento->id,
        ]);
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
    public function quitarEvento($id)
    {
        $this->ActualizarEstadoEvento($id);
    
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'El evento no existe.',], 404);
        }

        $evento->MOSTRAR = false;
        $estadoEvento = $evento->ESTADO;

        if ($estadoEvento == 'En espera') {
            $evento->save();
            return response()->json(['message' => 'Atributo MOSTRAR actualizado a FALSE con éxito.', 'id' => $id,], 200);
        } else {
            return response()->json(['message' => 'El evento no se puede eliminar porque no está en estado En espera.',], 400);
        }
    }

    public function actualizarEstado($id)
    {
        if (!$evento) {
            return response()->json([
                'status' => 404,
                'message' => 'Evento no encontrado',
            ]);
        }
        $this->ActualizarEstadoEvento($id);
        return response()->json(['message' => 'El estado se actualizo correctamente',], 200);
    }
    
    private function ActualizarEstadoEvento($id)
    {
        $fechaHora = Carbon::now()->subHours(4);
        $fechaActual = $fechaHora->format('Y-m-d');
        $horaActual = $fechaHora->format('H:i:s');

        $evento = Evento::find($id);

        if (!$evento) {
            return;
        }

        $fechaEvento = $evento->FECHA;
        $horaEvento = $evento->HORA;

        $estado = 'En espera';
        if ($fechaActual >= $fechaEvento && $horaActual >= $horaEvento) {
            $estado = 'En proceso';
        } elseif ($fechaActual > $fechaEvento) {
            $estado = 'Terminado';
        }

        $evento->ESTADO = $estado;
        $evento->save();
    }
}

