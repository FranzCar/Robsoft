<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CodigosVerificacion;
use App\Models\Persona;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\CodigoVerificacionMail;

class CodigosVerificacionController extends Controller
{
    public function generarYEnviarCodigo(Request $request)
{
    $correoPersona = $request->correo_electronico;
    $idEvento = $request->idEvento;

    $uuid = Str::uuid();
    $codigo = Str::random(3); // Generar un código aleatorio
    $expiracion = Carbon::now()->addMinutes(10); // Tiempo de expiración del código

    // Crear un nuevo registro de código de verificación
    $codigoVerificacion = CodigosVerificacion::create([
        'codigo' => $codigo,
        'expiracion' => $expiracion,
        'uuid' => $uuid,
        'id_evento' => $idEvento
    ]);

    // Enviar el correo electrónico con el código de verificación
    Mail::to($correoPersona)->send(new CodigoVerificacionMail($codigo));

    // Devolver el UUID para su uso posterior
    return response()->json(['uuid' => $uuid]);
}

public function confirmarCodigo(Request $request)
{
    $request->validate([
        'uuid' => 'required',
        'codigo' => 'required'
    ]);

    $codigoVerificacion = CodigosVerificacion::where('uuid', $request->uuid)
                                    ->where('codigo', $request->codigo)
                                    ->first();

    // Verificar si el código existe
    if (!$codigoVerificacion) {
        return response()->json(['message' => 'Código inválido'], 400);
    }

    // Verificar si el código ha expirado
    if ($codigoVerificacion->expiracion < Carbon::now()) {
        return response()->json(['message' => 'Código expirado'], 400);
    }

    $codigoVerificacion->confirmado = true;
    $codigoVerificacion->save();
    
    return response()->json(['message' => 'Registro completado y código confirmado con éxito']);
}

}
