<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolesTareas extends Model
{
    public $timestamps = false;
    protected $table = 'ROLES_TAREAS';
    public $incrementing = true;
    use HasFactory;
}
