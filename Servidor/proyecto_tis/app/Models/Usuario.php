<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    public $timestamps = false;
    protected $table = 'USUARIO';
    protected $primaryKey = 'id_usuario';
    public $incrementing = true;
    use HasFactory;

    public function roles() {
        // Esta es una relación de muchos a muchos, asumiendo que existe una tabla pivot 'usuario_roles'
        return $this->belongsToMany(Roles::class, 'usuario_roles', 'id_usuario', 'id_roles');
    }
}
