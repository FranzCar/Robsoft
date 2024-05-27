<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioRoles extends Model
{
    public $timestamps = false;
    protected $table = 'USUARIO_ROLES';
    public $incrementing = true;
    use HasFactory;
}
