<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disponibilidad extends Model
{
    protected $table = 'DISPONIBILIDAD';
    public $timestamps = false;
    use HasFactory;

    /*public function ubicacion()
    {
        return $this->belongsToMany(ubicacion::class, 'id_ubicacion');
    }
    public function horario()
    {
        return $this->belongsToMany(Horario::class, 'id_horario');
    }*/


}
