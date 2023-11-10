<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaTextoEvento extends Model
{
    protected $table = 'CARACTERISTICA_TEXTO_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_texto_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
