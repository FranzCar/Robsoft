<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaIntEvento extends Model
{
    protected $table = 'CARACTERISTICA_INT_EVENTO';
    protected $primaryKey = 'id_ci_e';
    public $timestamps = false;
    protected $fillable = ['id_ci_e', 'valor_int_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
