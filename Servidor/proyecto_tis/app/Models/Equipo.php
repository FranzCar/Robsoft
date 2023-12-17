<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    protected $primaryKey = 'id_equipo';
    public $incrementing = true;
    public $timestamps = false;
    protected $table = 'EQUIPO';
    use HasFactory;
}
