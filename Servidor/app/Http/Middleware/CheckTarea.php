<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\Tarea;

class CheckTarea
{
    protected $publicRoutes = [
        'lista-evento-detallado',
        'inscribir-equipo',
        'inscribir-individual',
        'guardar-participante',
        'lista-participantes',
        'guardar-equipo',
        'lista-coach',
        'lista-coach-institucion',
        'login-usuario',
        'enviar-notificacion',
        'enviar-codigo-verificacion',
        'confirmar-codigo-verificacion',
        'lista-participantes-institucion',
        'lista-instituciones',
    ];

    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $routeName = $request->route()->getName();

        if (in_array($routeName, $this->publicRoutes)) {
            return $next($request);
        }

        // Obtener las tareas del usuario desde la caché
        $tareas = Cache::remember("tareas_usuario_{$user->id_usuario}", 60, function() use ($user) {
            return $user->roles()->with('tareas')->get()->pluck('tareas.*.nombre_tarea')->flatten()->toArray();
        });

        if (!$tareas) {
            return response()->json(['error' => 'Permisos no encontrados'], 403);
        }

        $tareaRequerida = $this->getTareaRequerida($request->route()->getActionMethod(), $routeName);

        if ($tareaRequerida && !in_array($tareaRequerida, $tareas)) {
            return response()->json(['error' => 'Acceso denegado'], 403);
        }

        return $next($request);
    }

    protected function getTareaRequerida($metodo, $ruta)
    {
        $map = [
            'GET' => [
                'eventos' => 'ver_eventos',
                'evento/{id}' => 'ver_evento',
                'eventos-no-mostrar' => 'ocultar_eventos',
                'actualizar-estado' => 'actualizar_estado',
                'eventos-modificables' => 'modificar_evento',
                'lista-equipos' => 'ver_equipos',
                'lista-organizadores' => 'ver_organizadores',
                'lista-auspiciadores' => 'ver_auspiciadores',
                'eventos-eliminables' => 'ver_eventos_eliminables',
                'eventos-con-inscritos' => 'ver_eventos_con_inscritos',
                'inscritos-evento/{id}' => 'ver_inscritos_evento',
                'evento-con-etapas/{id}' => 'ver_evento_con_etapas',
                'evento-con-detalles/{id}' => 'ver_evento_con_detalles',
                'reporte-eventos' => 'reporte_eventos',
                'lista-usuarios' => 'ver_usuarios',
                'lista-roles' => 'ver_roles',
                'lista-tareas' => 'ver_tareas',
                'lista-roles-tareas' => 'ver_roles_tareas',
                'tareas_de_usuario/{id}' => 'ver_tareas_usuario',
                'roles_de_usuario/{id}' => 'ver_roles_usuario',
                'participantes-por-genero/{id}' => 'distribucion_genero',
            ],
            'POST' => [
                'validar-evento' => 'validar_evento',
                'guardar-evento' => 'guardar_evento',
                'detallar-evento/{id}' => 'detallar_evento',
                'guardar-etapa/{id}' => 'guardar_etapa',
                'guardar-coach' => 'guardar_coach',
                'roles-actualizar-tareas' => 'actualizar_roles_tareas',
                'usuarios-actualizar-roles' => 'actualizar_usuarios_roles',
                'crear-usuario' => 'crear_usuario',
            ],
            'PUT' => [
                'evento/{id}' => 'actualizar_evento',
                'actualizar-participante/{id}' => 'actualizar_participante',
            ],
            'DELETE' => [
                'quitar-evento/{id}' => 'eliminar_evento',
            ],
        ];

        return $map[$metodo][$ruta] ?? null;
    }
}
