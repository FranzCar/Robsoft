<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaDecimalEvento extends Model
{
    protected $table = 'CARACTERISTICA_DECIMAL_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_decimal_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
