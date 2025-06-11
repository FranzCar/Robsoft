<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicasTipoEvento extends Model
{
    protected $table = 'CARACTERISTICAS_TIPO_EVENTO';
    public $timestamps = false;
    use HasFactory;
    
    public function caracteristicaEvento()
    {
        return $this->belongsTo(CaracteristicasEvento::class, 'id_caracteristica_evento');
    }
}
