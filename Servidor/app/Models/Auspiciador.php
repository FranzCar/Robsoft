<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Auspiciador extends Model
{
    public $timestamps = false;
    protected $table = 'AUSPICIADOR';
    protected $primaryKey = 'id_auspiciador';
    use HasFactory;
}
