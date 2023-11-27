<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaFechaPersona extends Model
{
    protected $table = 'CARACTERISTICA_FECHA_PERSONA';
    protected $primaryKey = 'id_cf_p';
    protected $fillable = ['id_cf_p', 'valor_fecha_persona', 'id_caract_per', 'id_persona'];
    public $timestamps = false;
    use HasFactory;
}
