<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CodigoVerificacion;
use App\Models\Persona;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\CodigoVerificacionMail;

class CodigosVerificacionController extends Controller
{
    public function registrar(Request $request)
{
    // Aquí se reciben los datos del formulario
    $datosFormulario = $request->all();

    // Serializar los datos para enviar al método
    $datosSerializados = json_encode($datosFormulario);

    // Llamar al método para generar y enviar el código
    $uuid = $this->generarYEnviarCodigo($datosSerializados, $datosFormulario['id_evento']);

}

    public function generarYEnviarCodigo($datosRegistroSerializados, $idEvento)
{
    $uuid = Str::uuid();
    $codigo = Str::random(3);
    $expiracion = Carbon::now()->addMinutes(2);

    $codigoVerificacion = CodigosVerificacion::create([
        'codigo' => $codigo,
        'expiracion' => $expiracion,
        'uuid' => $uuid,
        'datos_registro' => $datosRegistroSerializados,
        'id_evento' => $idEvento // Agregamos el id_evento aquí
    ]);

    $datosRegistro = json_decode($datosRegistroSerializados, true); // Decodificamos los datos serializados
    Mail::to($datosRegistro['correo_electronico'])->send(new CodigoVerificacionMail($codigo));

    return $uuid; // Devolver UUID para su uso posterior
}

    public function confirmarCodigo(Request $request)
{
    $request->validate([
        'uuid' => 'required',
        'codigo' => 'required'
    ]);

    $codigoVerificacion = CodigoVerificacion::where('uuid', $request->uuid)
                                    ->where('codigo', $request->codigo)
                                    ->first();

    if (!$codigoVerificacion || $codigoVerificacion->expiracion < Carbon::now()) {
        return response()->json(['message' => 'Código inválido o expirado'], 400);
    }

    // Deserializar los datos de registro y crear la nueva persona y otros registros necesarios
    $datosRegistro = json_decode($codigoVerificacion->datos_registro, true);

    // Usar el servicio para registrar al estudiante
    $persona = $this->registroEstudianteService->registrarEstudiante($datosRegistro);

    $codigoVerificacion->confirmado = true;
    $codigoVerificacion->save();

    return response()->json(['message' => 'Registro completado y código confirmado con éxito', 'id' => $persona->id_persona]);
}


}
