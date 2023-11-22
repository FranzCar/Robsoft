<?php

use App\Notifications\PruebaNotificacion;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    Notification::route('mail', 'franzluiz10@gmail.com')->notify(new PruebaNotificacion());
    return view('welcome');
});
