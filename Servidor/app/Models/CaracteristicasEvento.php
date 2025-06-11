<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicasEvento extends Model
{
    protected $table = 'CARACTERISTICAS_EVENTO';
    protected $primaryKey = 'id_caracteristica_evento';
    public $timestamps = false;
    use HasFactory;
}
