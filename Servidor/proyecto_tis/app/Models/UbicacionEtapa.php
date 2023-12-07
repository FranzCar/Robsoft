<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UbicacionEtapa extends Model
{
    protected $table = 'UBICACION_ETAPA';
    public $timestamps = false;
    use HasFactory;

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }
}
