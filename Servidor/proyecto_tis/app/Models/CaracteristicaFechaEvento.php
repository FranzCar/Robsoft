<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaFechaEvento extends Model
{
    protected $table = 'CARACTERISTICA_FECHA_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_fecha_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
