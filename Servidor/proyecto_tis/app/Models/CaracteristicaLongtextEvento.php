<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaLongtextEvento extends Model
{
    protected $table = 'CARACTERISTICA_LONGTEXT_EVENTO';
    public $timestamps = false;
    protected $fillable = ['valor_longtext_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
