<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $table = 'UBICACION';
    public $timestamps = false;
    use HasFactory;
    public function auspiciadores()
    {
        return $this->belongsToMany(Auspiciador::class, 'EVENTO_AUSPICIADOR', 'id_evento', 'id_auspiciador');
    }

}
