<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    public $timestamps = true;
    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    protected $fillable = ['username', 'password', 'api_token'];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function roles() {
        return $this->belongsToMany(Roles::class, 'usuario_roles', 'id_usuario', 'id_roles');
    }

    // Obtener tareas a través de roles
    public function tareas() {
        return $this->hasManyThrough(
            Tareas::class,
            Roles::class,
            'id_usuario',    // Clave foránea en 'usuario_roles'
            'id_roles',      // Clave foránea en 'roles_tareas'
            'id_usuario',    // Clave local en 'usuario'
            'id_roles'       // Clave local en 'roles'
        );
    }
}
