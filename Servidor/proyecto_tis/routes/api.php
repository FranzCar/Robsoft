<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\ParticipanteController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\EquipoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('eventos',[EventoController::class, 'index']);
Route::post('validar-evento',[EventoController::class, 'validarFormulario']);
Route::post('guardar-evento',[EventoController::class, 'guardarEvento']);
Route::get('evento/{id}',[EventoController::class, 'show']);
Route::put('evento/{id}',[EventoController::class, 'update']);
Route::delete('evento/{id}',[EventoController::class, 'destroy']);
Route::get('eventos-no-mostrar', [EventoController::class, 'getEventosNoMostrar']);
Route::get('eventos-mostrar', [EventoController::class, 'getEventosMostrar']);
Route::patch('quitar-evento/{id}', [EventoController::class, 'QuitarEvento']);
Route::get('actualizar-estado',[EventoController::class, 'actualizarEstadoTodos']);
Route::post('guardar-participante',[ParticipanteController::class, 'store']);
Route::get('lista-participantes',[ParticipanteController::class, 'listParticipantes']);
Route::get('lista-coachs',[CoachController::class, 'listaCoachs']);
Route::post('guardar-equipo',[EquipoController::class, 'store']);

