<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaDecimalEvento extends Model
{
    protected $table = 'CARACTERISTICA_DECIMAL_EVENTO';
    protected $primaryKey = 'id_cd_e';
    public $timestamps = false;
    protected $fillable = ['id_cd_e','valor_decimal_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
