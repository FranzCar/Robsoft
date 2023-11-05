<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaTextoPersona extends Model
{
    protected $table = 'CARACTERISTICA_TEXTO_PERSONA';
    protected $fillable = ['valor_texto_persona', 'id_caracteristica_persona', 'id_persona'];
    public $timestamps = false;
    use HasFactory;
}
