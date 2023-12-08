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
}
