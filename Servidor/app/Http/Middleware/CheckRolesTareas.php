<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRolesTareas
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next, $taskName)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Verifica si alguno de los roles del usuario tiene la tarea requerida
        $hasTask = $user->roles->any(function ($role) use ($taskName) {
            return $role->tareas->contains('nombre_tarea', $taskName);
        });

        if (!$hasTask) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        return $next($request);
    }
}
