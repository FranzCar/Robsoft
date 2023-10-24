<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventoController;

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

Route::post('guardar-participante',[EventoController::class, 'guardarParticipante']);
