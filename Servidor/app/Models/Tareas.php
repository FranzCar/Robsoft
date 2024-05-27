<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tareas extends Model
{
    public $timestamps = false;
    protected $table = 'TAREAS';
    protected $primaryKey = 'id_tarea';
    public $incrementing = true;
    use HasFactory;
}
