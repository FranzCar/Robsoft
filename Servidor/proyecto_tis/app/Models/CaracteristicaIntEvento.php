<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaIntEvento extends Model
{
    protected $table = 'CARACTERISTICA_INT_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_int_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
