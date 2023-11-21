<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodigosVerificacion extends Model
{
    use HasFactory;

    protected $table = 'CODIGOS_VERIFICACION';
    protected $primaryKey = 'id_codigo';
    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'confirmado',
        'expiracion',
        'id_persona',
        'id_evento'
    ];
}
