<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Exception;

class EventoController extends Controller
{
    
    public function index()
    {
        $eventos = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])->get();
        return $eventos->map(function ($evento) {
            return [
                'id_evento' => $evento->id_evento,
                'TITULO' => $evento->TITULO,
                'ESTADO' => $evento->ESTADO,
                'FECHA_INICIO' => $evento->FECHA_INICIO,
                'FECHA_FIN' => $evento->FECHA_FIN,
                'DESCRIPCION' => $evento->DESCRIPCION,
                'MOSTRAR' => $evento->MOSTRAR,
                'AFICHE' => $evento->AFICHE,
                'TIPO_EVENTO' => $evento->tipoEvento->NOMBRE, // Asumiendo que 'NOMBRE' es el campo en TIPO_EVENTO
                'AUSPICIADORES' => $evento->auspiciadores->pluck('NOMBRE'), // Cambiar 'NOMBRE' por el campo correspondiente en AUSPICIADOR
                'ORGANIZADORES' => $evento->organizadores->pluck('NOMBRE') // Cambiar 'NOMBRE' por el campo correspondiente en ROL_PERSONA
            ];
        });
    }

    
    public function validarFormulario(Request $request) {
        // Reglas de validación
        $rules = [
            'TITULO' => [
                'required',
                'string',
                'min:5',
                'max:50',
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
            'PATROCINADOR' => 'required|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
        // Puedes agregar las demás reglas de los otros campos aquí si es necesario
        ];

        // Mensajes de error personalizados en español
        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute debe tener como máximo :max caracteres.',
            'regex' => 'El campo :attribute contiene caracteres no permitidos.',
            'image' => 'El campo :attribute debe ser una imagen.',
            'mimes' => 'El campo :attribute debe ser de tipo .jpeg o .png.',
            'dimensions' => 'El campo :attribute debe tener una resolución de al menos 400x600 y como máximo 1600x2400 píxeles.',
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
        return DB::transaction(function() use ($request) {
            try {
            
                $evento = new Evento();
                $evento->TITULO = $request->TITULO;
                $evento->FECHA_INICIO = $request->FECHA_INICIO;
                $evento->FECHA_FIN = $request->FECHA_FIN;
                $evento->DESCRIPCION = $request->DESCRIPCION;
                $evento->AFICHE = $request->AFICHE;
                $evento->id_tipo_evento = $request->id_tipo_evento;

                $evento->save();
                // Asociar Patrocinador al evento
                if ($request->has('auspiciadores')) {
                    foreach ($request->auspiciadores as $id_auspiciador) {
                        DB::table('EVENTO_AUSPICIADOR')->insert([
                            'id_evento' => $evento->id_evento,
                            'id_auspiciador' => $id_auspiciador,
                        ]);
                    }
                }
                // Asociar Organizador al evento
                if ($request->has('organizadores')) {
                    foreach ($request->organizadores as $id_rol_persona) {
                        DB::table('ROL_PERSONA_EN_EVENTO')->insert([
                            'id_rol_persona' => $id_rol_persona,
                            'id_evento' => $evento->id_evento, 
                        ]);
                    }
                }

                $this->actualizarEstadoTodos();
    
                // Devolver una respuesta exitosa al cliente
                return response()->json(['status' => 'success', 'message' => 'Evento guardado con éxito']);

            } catch (\Exception $e) {
                // Registrar el mensaje de error en el log
                \Log::error('Error al guardar evento: ' . $e->getMessage());
            
                // Devolver el mensaje de error detallado al cliente (solo en ambiente de desarrollo)
                if (app()->environment('local')) {
                    return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el evento', 'error_detail' => $e->getMessage()], 500);
                } else {
                    return response()->json(['status' => 'error', 'message' => 'Hubo un error al guardar el evento'], 500);
                }
            }
        });
    }

    public function show($id)
    {
        $evento = Evento::find($id);
        return $evento;
    }

    
    public function update(Request $request, $id)
    {
       /* // Validar los datos de entrada
        $rules = [
            'TITULO' => [
                'required',
                'string',
                'min:5',
                'max:50',
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
           // 'PATROCINADOR' => 'sometimes|string|min:5|max:20|regex:/^[\pL\pN\s.,!?@:;\'-]+$/u',
            // Puedes agregar las demás reglas de los otros campos aquí si es necesario
        ];

        // Mensajes de error personalizados en español
        $messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'max' => 'El campo :attribute debe tener como máximo :max caracteres.',
            'regex' => 'El campo :attribute contiene caracteres no permitidos.',
        ];

        $request->validate($rules, $messages);*/

        // Buscar el evento
        $evento = Evento::findOrFail($id);

        // Actualizar los datos del evento
        $evento->TITULO = $request->TITULO;
        $evento->FECHA_INICIO = $request->FECHA_INICIO;
        $evento->FECHA_FIN = $request->FECHA_FIN;
        $evento->DESCRIPCION = $request->DESCRIPCION;
        $evento->AFICHE = $request->AFICHE;
        $evento->id_tipo_evento = $request->id_tipo_evento;

        // Guardar el evento
        $evento->save();

        // Asociar Patrocinador al evento
        if ($request->has('auspiciadores')) {
            foreach ($request->auspiciadores as $id_auspiciador) {
                DB::table('EVENTO_AUSPICIADOR')->insert([
                    'id_evento' => $evento->id_evento,
                    'id_auspiciador' => $id_auspiciador,
                ]);
            }
        }
        // Asociar Organizador al evento
        if ($request->has('organizadores')) {
            foreach ($request->organizadores as $id_rol_persona) {
                DB::table('ROL_PERSONA_EN_EVENTO')->insert([
                    'id_rol_persona' => $id_rol_persona,
                    'id_evento' => $evento->id_evento, 
                ]);
            }
        }

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
        $this->actualizarEstadoTodos();
    
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
    public function actualizarEstadoTodos()
    {
        $fechaHora = Carbon::now()->subHours(4);
        $fechaActual = $fechaHora->format('Y-m-d');
        $horaActual = $fechaHora->format('H:i:s');

        $eventos = Evento::all();

        foreach ($eventos as $evento) {
            $fechaEvento = $evento->FECHA_INICIO;
            $horaEvento = $evento->HORA;

            $estado = 'En espera';
            if ($fechaActual == $fechaEvento && $horaActual >= $horaEvento) {
                $estado = 'En proceso';
            } elseif ($fechaActual > $fechaEvento ) {
                $estado = 'Terminado';
            }

            $evento->ESTADO = $estado;
            $evento->save();
        }

        return response()->json(['success' => true]);
    }
    public function getEventosEnEspera() {
        $eventos = DB::select('CALL EventosEnEspera()');
        return response()->json($eventos);
    }
}

