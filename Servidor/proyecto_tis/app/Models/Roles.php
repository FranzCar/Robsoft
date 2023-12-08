<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    public $timestamps = false;
    protected $table = 'ROLES';
    protected $primaryKey = 'id_roles';
    public $incrementing = true;
    use HasFactory;

    public function tareas()
    {
        return $this->belongsToMany(Tareas::class, 'ROLES_TAREAS', 'id_roles', 'id_tarea');
    }
}
