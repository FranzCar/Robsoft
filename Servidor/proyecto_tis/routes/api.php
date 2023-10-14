<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('eventos',[EventoController::class, 'index']);
Route::post('evento',[EventoController::class, 'store']);
Route::get('evento/{id}',[EventoController::class, 'show']);
Route::put('evento/{id}',[EventoController::class, 'update']);
Route::delete('evento/{id}',[EventoController::class, 'destroy']);
