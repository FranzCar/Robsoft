<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    public $timestamps = false;
    protected $table = 'equipo';
    use HasFactory;
}
