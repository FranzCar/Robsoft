<?php

namespace App\Http\Controllers\Api;

use App\Models\Evento;
use App\Models\CaracteristicasTipoEvento;
use App\Models\CaracteristicaTextoEvento;
use App\Models\CaracteristicaFechaEvento;
use App\Models\CaracteristicaIntEvento;
use App\Models\CaracteristicaDecimalEvento;
use App\Models\CaracteristicaLongtextEvento;
use App\Models\CaracteristicaBooleanEvento;
use App\Models\Inscripcion;
use App\Models\Etapa;
use App\Models\Persona;
use App\Notifications\EventoNotificacion;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\Services\EstadoEventoService;

class EventoController extends Controller
{
    protected $estadoEventoService;

    // Inyectar el servicio en el constructor
    public function __construct(EstadoEventoService $estadoEventoService)
    {
        $this->estadoEventoService = $estadoEventoService;
    }

    public function index()
{
    $eventos = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])->get();
    return $this->transformarEventos($eventos);
}

public function listaEventoDetallado()
{
    $eventos = Evento::with(['tipoEvento.caracteristicasTipoEvento.caracteristicaEvento'])
    ->whereIn('ESTADO', ['Listo', 'Inscrito'])
        ->get()
        ->map(function ($evento) {
            $caracteristicasPorNombre = [];

            foreach ($evento->tipoEvento->caracteristicasTipoEvento as $caracteristicaTipoEvento) {
                $nombreCaracteristica = $caracteristicaTipoEvento->caracteristicaEvento->nombre_caracteristica_evento;
                $tipoDato = $caracteristicaTipoEvento->caracteristicaEvento->tipo_dato_caracteristica_evento;

                $valorCaracteristica = $this->obtenerValorCaracteristicaParaEvento(
                    $evento->id_evento,
                    $caracteristicaTipoEvento->id_caracteristica_evento,
                    $tipoDato
                );

                $caracteristicasPorNombre[$nombreCaracteristica] = $valorCaracteristica;
            }

            return [
                'id_evento' => $evento->id_evento,
                'TITULO' => $evento->TITULO,
                'ESTADO' => $evento->ESTADO,
                'FECHA_INICIO' => $evento->FECHA_INICIO,
                'FECHA_FIN' => $evento->FECHA_FIN,
                'DESCRIPCION' => $evento->DESCRIPCION,
                'AFICHE' => $evento->AFICHE,
                'TIPO_EVENTO' => $evento->tipoEvento->nombre_tipo_evento,
                
                'caracteristicas' => $caracteristicasPorNombre,
            ];
        });

    return response()->json($eventos);
}

    private function obtenerValorCaracteristicaParaEvento($idEvento, $idCaracteristicaEvento, $tipoDato)
{
    switch ($tipoDato) {
        case 'varchar':
            $caracteristica = CaracteristicaTextoEvento::where('id_evento', $idEvento)
                            ->where('id_caracteristica_evento', $idCaracteristicaEvento)
                            ->first();
            return $caracteristica ? $caracteristica->valor_texto_evento : null;

        case 'int':
            $caracteristica = CaracteristicaIntEvento::where('id_evento', $idEvento)
                            ->where('id_caracteristica_evento', $idCaracteristicaEvento)
                            ->first();
            return $caracteristica ? $caracteristica->valor_int_evento : null;

        case 'decimal':
            $caracteristica = CaracteristicaDecimalEvento::where('id_evento', $idEvento)
                            ->where('id_caracteristica_evento', $idCaracteristicaEvento)
                            ->first();
            return $caracteristica ? $caracteristica->valor_decimal_evento : null;

        case 'boolean':
            $caracteristica = CaracteristicaBooleanEvento::where('id_evento', $idEvento)
                            ->where('id_caracteristica_evento', $idCaracteristicaEvento)
                            ->first();
            return $caracteristica ? $caracteristica->valor_boolean_evento : null;

    }
}


private function transformarEventos($eventos)
{
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
            'TIPO_EVENTO' => $evento->tipoEvento->nombre_tipo_evento,
            'AUSPICIADORES' => $evento->auspiciadores->map(function ($auspiciador) {
                return [
                    'id' => $auspiciador->id_auspiciador,
                    'nombre' => $auspiciador->nombre_auspiciador
                ];
            }),
            'ORGANIZADORES' => $evento->organizadores->map(function ($organizador) {
                $persona = $organizador->persona;
                return [
                    'id' => $organizador->id_rol_persona,
                    'nombre' => $persona ? $persona->nombre : 'Nombre no disponible',
                ];
            }),
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
    $evento = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])->find($id);

    if (!$evento) {
        return response()->json(['message' => 'Evento no encontrado'], 404);
    }

    return [
        'id_evento' => $evento->id_evento,
        'TITULO' => $evento->TITULO,
        'ESTADO' => $evento->ESTADO,
        'FECHA_INICIO' => $evento->FECHA_INICIO,
        'FECHA_FIN' => $evento->FECHA_FIN,
        'DESCRIPCION' => $evento->DESCRIPCION,
        'MOSTRAR' => $evento->MOSTRAR,
        'AFICHE' => $evento->AFICHE,
        'TIPO_EVENTO' => [
            'id' => $evento->tipoEvento->id_tipo_evento ?? null,
            'nombre' => $evento->tipoEvento->nombre_tipo_evento ?? 'Tipo no disponible'
        ],
        'AUSPICIADORES' => $evento->auspiciadores->map(function ($auspiciador) {
            return [
                'id' => $auspiciador->id_auspiciador,
                'nombre' => $auspiciador->nombre_auspiciador
            ];
        }),
        'ORGANIZADORES' => $evento->organizadores->map(function ($rolPersona) {
            $persona = $rolPersona->persona;
            return [
                'id' => $rolPersona->id_rol_persona,
                'nombre' => $persona ? $persona->nombre : 'Nombre no disponible',
            ];
        }),
    ];
}

    
public function update(Request $request, $id) {
    return DB::transaction(function() use ($request, $id) {
        try {
            $evento = Evento::findOrFail($id);

            $evento->TITULO = $request->TITULO;
            $evento->FECHA_INICIO = $request->FECHA_INICIO;
            $evento->FECHA_FIN = $request->FECHA_FIN;
            $evento->DESCRIPCION = $request->DESCRIPCION;
            $evento->AFICHE = $request->AFICHE;
            $evento->id_tipo_evento = $request->id_tipo_evento;
            $evento->save();

            // Eliminar relaciones existentes de auspiciadores y organizadores
            DB::table('EVENTO_AUSPICIADOR')->where('id_evento', $evento->id_evento)->delete();
            DB::table('ROL_PERSONA_EN_EVENTO')->where('id_evento', $evento->id_evento)->delete();

            // Asociar los nuevos auspiciadores al evento
            if ($request->has('auspiciadores')) {
                foreach ($request->auspiciadores as $id_auspiciador) {
                    DB::table('EVENTO_AUSPICIADOR')->insert([
                        'id_evento' => $evento->id_evento,
                        'id_auspiciador' => $id_auspiciador,
                    ]);
                }
            }

            // Asociar los nuevos organizadores al evento
            if ($request->has('organizadores')) {
                foreach ($request->organizadores as $id_rol_persona) {
                    DB::table('ROL_PERSONA_EN_EVENTO')->insert([
                        'id_rol_persona' => $id_rol_persona,
                        'id_evento' => $evento->id_evento, 
                    ]);
                }
            }

            $this->actualizarEstadoTodos();

            return response()->json(['status' => 'success', 'message' => 'Evento actualizado con éxito']);

        } catch (\Exception $e) {
            \Log::error('Error al actualizar evento: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Hubo un error al actualizar el evento', 'error_detail' => $e->getMessage()], 500);
        }
    });
}

    public function getEventosNoMostrar() {
        $eventos = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])
                     ->where('MOSTRAR', 0)
                     ->orderBy('id_evento', 'desc')
                     ->get();
            
            return $this->transformarEventos($eventos);

    }               
    public function getEventosMostrar() 
{
    $eventos = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])
                     ->where('MOSTRAR', 1)
                     ->orderBy('id_evento', 'desc')
                     ->get();

    return $this->transformarEventos($eventos);
}
public function quitarEvento($id)
{
    DB::beginTransaction();

    try {
        $evento = Evento::findOrFail($id);

        switch ($evento->ESTADO) {
            case 'En espera':
                // Si el evento está en estado 'En espera', eliminar directamente
                $this->eliminarEvento($evento);
                break;
            case 'Listo':
                // Si el evento está en estado 'Listo', eliminar etapas y características del evento
                $this->eliminarEtapaYCaracteristicas($evento);
                $this->eliminarEvento($evento);
                break;
            case 'Inscrito':
                // Si el evento está en estado 'Inscrito', eliminar inscripciones, etapas y características del evento
                $this->eliminarInscripciones($evento);
                $this->eliminarEtapaYCaracteristicas($evento);
                $this->eliminarEvento($evento);
                break;
            default:
                return response()->json(['message' => 'El evento no se puede eliminar en el estado actual.'], 400);
        }

        DB::commit();
        return response()->json(['message' => 'Evento eliminado con éxito.'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Error al eliminar el evento', 'error' => $e->getMessage()], 500);
    }
}

private function eliminarEvento($evento)
{
    try {
        // Iniciar transacción
        DB::beginTransaction();

        // Eliminar relaciones en EVENTO_AUSPICIADOR
        DB::table('EVENTO_AUSPICIADOR')->where('id_evento', $evento->id_evento)->delete();

        // Eliminar relaciones en ROL_PERSONA_EN_EVENTO
        DB::table('ROL_PERSONA_EN_EVENTO')->where('id_evento', $evento->id_evento)->delete();

        // Agrega aquí la eliminación de otras relaciones si es necesario

        // Eliminar el evento
        $evento->delete();

        // Confirmar transacción
        DB::commit();
    } catch (\Exception $e) {
        // Revertir todas las operaciones en caso de error
        DB::rollBack();
        \Log::error("Error al eliminar evento: " . $e->getMessage());
        throw $e;
    }
}

private function eliminarEtapaYCaracteristicas($evento)
{
    // Eliminar etapas y características asociadas al evento
    Etapa::where('id_evento', $evento->id)->delete();
    CaracteristicaLongtextEvento::where('id_evento', $evento->id)->delete();
    CaracteristicaTextoEvento::where('id_evento', $evento->id)->delete();
    CaracteristicaIntEvento::where('id_evento', $evento->id)->delete();
    CaracteristicaFechaEvento::where('id_evento', $evento->id)->delete();
}

private function eliminarInscripciones($evento)
{
    // Eliminar inscripciones asociadas al evento
    Inscripcion::where('id_evento', $evento->id)->delete();
}

    public function actualizarEstadoTodos()
    {
        $fechaActual = Carbon::now();
    
        $eventos = Evento::all();
    
        foreach ($eventos as $evento) {
            // Determinar si el evento tiene inscripciones, etapas, o características
            $tieneInscripciones = Inscripcion::where('id_evento', $evento->id_evento)->exists();
            $tieneCaracteristicasOEtapa = Etapa::where('id_evento', $evento->id_evento)->exists()  && (
                                          CaracteristicaLongtextEvento::where('id_evento', $evento->id_evento)->exists() ||
                                          CaracteristicaTextoEvento::where('id_evento', $evento->id_evento)->exists() ||
                                          CaracteristicaIntEvento::where('id_evento', $evento->id_evento)->exists() ||
                                          CaracteristicaFechaEvento::where('id_evento', $evento->id_evento)->exists());    
            // Lógica para actualizar el estado
            if ($evento->ESTADO == 'En espera' && $tieneCaracteristicasOEtapa) {
                $evento->ESTADO = 'Listo';
            } elseif ($evento->ESTADO == 'Listo' && $tieneInscripciones) {
                $evento->ESTADO = 'Inscrito';
            } elseif ($evento->ESTADO == 'Inscrito' && $fechaActual->between($evento->FECHA_INICIO, $evento->FECHA_FIN)) {
                $evento->ESTADO = 'En curso';
            } elseif (($evento->ESTADO == 'En espera' || $evento->ESTADO == 'Listo') && $fechaActual->gt($evento->FECHA_FIN)) {
                $evento->ESTADO = 'Abandono';
            } elseif ($evento->ESTADO == 'En curso' && $fechaActual->gt($evento->FECHA_FIN)) {
                $evento->ESTADO = 'Terminado';
            }
    
            $evento->save();
        }
    
        return response()->json(['success' => true]);
    }
    public function getEventosEnEspera() {
        $eventos = Evento::with(['tipoEvento', 'auspiciadores', 'organizadores'])
                    ->where('MOSTRAR', 1)
                    ->where('ESTADO', 'En espera')
                    ->orderBy('id_evento', 'desc')
                    ->get();

        return $this->transformarEventos($eventos);
    }
    public function guardarCaracteristicasEvento(Request $request, $id) {
        // Encuentra el evento y su tipo
        $evento = Evento::with('tipoEvento')->findOrFail($id);
        $tipoEventoId = $evento->id_tipo_evento;

        // Obtener las características asociadas al tipo de evento
        $caracteristicas = CaracteristicasTipoEvento::where('id_tipo_evento', $tipoEventoId)->with('caracteristicaEvento')->get();
    
        // Inicia una transacción de base de datos
        DB::beginTransaction();
        try {
            // Asociar Facilitador al evento
            if ($request->has('Facilitador')) {
                $id_rol_persona = $request->input('Facilitador');
                DB::table('ROL_PERSONA_EN_EVENTO')->insert([
                    'id_rol_persona' => $id_rol_persona,
                    'id_evento' => $evento->id_evento, 
                ]);
            }

            foreach ($caracteristicas as $caracteristica) {
                $idCaracteristica = $caracteristica->id_caracteristica_evento;
                $tipoDato = $caracteristica->caracteristicaEvento->tipo_dato_caracteristica_evento;
                
                // Verificar el tipo de dato y guardar en la tabla correspondiente
                $valor = $request->input('caracteristica_'.$idCaracteristica);
                if ($valor === null) {
                    continue; // Si no se envió esta característica, continuar con la siguiente
                }
                // Dependiendo del tipo de dato, guarda la característica en la tabla correspondiente
                switch ($tipoDato) {
                    case 'longtext':
                        CaracteristicaLongtextEvento::create([
                            'valor_longtext_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    case 'decimal':
                        CaracteristicaDecimalEvento::create([
                            'valor_decimal_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    case 'varchar':
                        CaracteristicaTextoEvento::create([
                            'valor_texto_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    case 'date':
                        CaracteristicaFechaEvento::create([
                            'valor_fecha_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    case 'int':
                        CaracteristicaIntEvento::create([
                            'valor_int_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    case 'boolean':
                        CaracteristicaBooleanEvento::create([
                            'valor_boolean_evento' => $valor,
                            'id_caracteristica_evento' => $caracteristica->id_caracteristica_evento,
                            'id_evento' => $evento->id_evento,
                        ]);
                        break;
                    // Añade más casos si hay más tipos de datos
                }
            }
    
            // Si todo ha ido bien, confirmamos los cambios
            DB::commit();
            
            // actualizar estado del evento
            $this->estadoEventoService->actualizarEstadoAListo($id);
            
            return response()->json(['message' => 'Características guardadas con éxito']);
        } catch (\Exception $e) {
            // Si algo sale mal, revertimos los cambios
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar las características', 'error' => $e->getMessage()], 500);
        }
    }
    public function enviarNotificacion(Request $request)
    {
        $persona = Persona::findOrFail($request->persona_id);
        $evento = Evento::findOrFail($request->evento_id);
        $tipo = $request->tipo; // 'eliminado' o 'modificado'

        Notification::send($persona, new EventoNotificacion($evento, $tipo));

        return response()->json(['message' => 'Notificación enviada con éxito.']);
    }
                   
}

