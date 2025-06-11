<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    protected function redirectTo($request)
    {
        if ($request->expectsJson()) {
            // Devolver una respuesta JSON directamente para APIs
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Aquí puedes manejar redirecciones web si fuera necesario, pero parece que no aplica en tu caso.
    }
}