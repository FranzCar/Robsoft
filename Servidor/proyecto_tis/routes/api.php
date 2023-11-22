<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\PersonaController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\Api\AuspiciadorController;
use App\Http\Controllers\Api\RolPersonaController;
use App\Http\Controllers\Api\InstitucionController;
use App\Http\Controllers\Api\DisponibilidadController;
use App\Http\Controllers\Api\EtapaController;
use App\Http\Controllers\Api\UbicacionController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('eventos',[EventoController::class, 'index']);
Route::post('validar-evento',[EventoController::class, 'validarFormulario']);
Route::post('guardar-evento',[EventoController::class, 'guardarEvento']);
Route::get('evento/{id}',[EventoController::class, 'show']);
Route::put('evento/{id}',[EventoController::class, 'update']);
Route::get('eventos-no-mostrar', [EventoController::class, 'getEventosNoMostrar']);
Route::get('eventos-mostrar', [EventoController::class, 'getEventosMostrar']);
Route::delete('quitar-evento/{id}', [EventoController::class, 'QuitarEvento']);
Route::get('actualizar-estado',[EventoController::class, 'actualizarEstadoTodos']);
Route::post('guardar-participante',[PersonaController::class, 'guardarEstudiante']);
Route::get('lista-participantes',[PersonaController::class, 'listParticipantes']);
//Route::post('guardar-equipo',[EquipoController::class, 'store']);
Route::get('eventos-modificables', [EventoController::class, 'getEventosEnEspera']);
//Route::get('lista-equipos',[EquipoController::class, 'listaEquipos']);
Route::get('lista-organizadores',[RolPersonaController::class, 'listaOrganizadores']);
Route::get('lista-coach',[RolPersonaController::class, 'listaCoach']);
Route::get('lista-auspiciadores',[AuspiciadorController::class, 'listaAuspiciadores']);
Route::get('lista-instituciones',[InstitucionController::class, 'listaInstitucion']);
Route::post('detallar-evento/{id}',[EventoController::class, 'guardarCaracteristicasEvento']);
Route::get('lista-facilitadores',[RolPersonaController::class, 'listaFacilitadores']);
Route::post('guardar-etapa/{id}', [EtapaController::class, 'guardarEtapa']);
Route::get('lista-ubicaciones',[UbicacionController::class, 'listaUbicaciones']);
Route::post('/enviar-notificacion', [EventoController::class, 'enviarNotificacion']);
