<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $primaryKey = 'id_evento';
    public $incrementing = true;
    protected $table = 'evento';
    public $timestamps = false;
    use HasFactory;

    public function tipoEvento()
    {
        return $this->belongsTo(TipoEvento::class, 'id_tipo_evento');
    }

    public function auspiciadores()
    {
        return $this->belongsToMany(Auspiciador::class, 'EVENTO_AUSPICIADOR', 'id_evento', 'id_auspiciador');
    }

    public function organizadores()
    {
        // Asumiendo que tienes un modelo para RolPersona
        return $this->belongsToMany(RolPersona::class, 'ROL_PERSONA_EN_EVENTO', 'id_evento', 'id_rol_persona');
    }
    public function facilitador()
    {
        return $this->belongsTo(RolPersona::class, 'ROL_PERSONA_EN_EVENTO', 'id_evento', 'id_rol_persona');
    }


    // ...
}
