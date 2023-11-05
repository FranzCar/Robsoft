<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaFechaPersona extends Model
{
    protected $table = 'CARACTERISTICA_FECHA_PERSONA';
    protected $fillable = ['valor_fecha_persona', 'id_caracteristica_persona', 'id_persona'];
    public $timestamps = false;
    use HasFactory;
}
