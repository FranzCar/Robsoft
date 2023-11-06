<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolPersona extends Model
{
    public $timestamps = false;
    protected $table = 'Rol_persona';
    protected $primaryKey = 'id_rol_persona';
    use HasFactory;
}
