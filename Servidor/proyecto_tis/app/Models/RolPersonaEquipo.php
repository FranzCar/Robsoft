<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolPersonaEquipo extends Model
{
    public $timestamps = false;
    protected $table = 'ROL_PERSONA_EQUIPO';
    use HasFactory;
    protected $fillable = ['id_rol_persona', 'id_equipo'];
}
