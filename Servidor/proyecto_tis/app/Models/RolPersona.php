<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolPersona extends Model
{
    public $timestamps = false;
    protected $table = 'ROL_PERSONA';
    protected $primaryKey = 'id_rol_persona';
    use HasFactory;

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
    public function rolPersonaEquipo()
    {
        return $this->hasMany(RolPersonaEquipo::class, 'id_rol_persona', 'id_rol_persona');
    }
}
