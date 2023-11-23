<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaBooleanEvento extends Model
{
    protected $table = 'CARACTERISTICA_BOOLEAN_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_boolean_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
