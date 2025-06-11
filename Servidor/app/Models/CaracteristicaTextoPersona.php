<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaTextoPersona extends Model
{
    protected $table = 'CARACTERISTICA_TEXTO_PERSONA';
    protected $primaryKey = 'id_ct_p';
    protected $fillable = ['id_ct_p', 'valor_texto_persona', 'id_caract_per', 'id_persona'];
    public $timestamps = false;
    use HasFactory;
}
