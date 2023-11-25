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
        return $this->belongsToMany(RolPersona::class, 'ROL_PERSONA_EN_EVENTO', 'id_evento', 'id_rol_persona');
    }
    public function facilitador()
    {
        return $this->belongsTo(RolPersona::class, 'ROL_PERSONA_EN_EVENTO', 'id_evento', 'id_rol_persona');
    }
    public function caracteristicasLongtext()
    {
        return $this->hasMany(CaracteristicaLongtextEvento::class, 'id_evento');
    }

    public function caracteristicasDecimal()
    {
        return $this->hasMany(CaracteristicaDecimalEvento::class, 'id_evento');
    }

    public function caracteristicasTexto()
    {
        return $this->hasMany(CaracteristicaTextoEvento::class, 'id_evento');
    }

    public function caracteristicasBoolean()
    {
        return $this->hasMany(CaracteristicaBooleanEvento::class, 'id_evento');
    }

    public function caracteristicasFecha()
    {
        return $this->hasMany(CaracteristicaFechaEvento::class, 'id_evento');
    }

    public function caracteristicasInt()
    {
        return $this->hasMany(CaracteristicaIntEvento::class, 'id_evento');
    }

    public function caracteristicasTipoEvento()
    {
        return $this->hasManyThrough(
            CaracteristicaEvento::class,
            CaracteristicasTipoEvento::class,
            'id_tipo_evento',
            'id_caracteristica_evento',
            'id_tipo_evento',
            'id_caracteristica_evento'
        );
    }
}