<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etapa extends Model
{
    protected $primaryKey = 'id_etapa';
    protected $table = 'ETAPA';
    public $incrementing = true;
    public $timestamps = false;
    use HasFactory;
    
    public function ubicacionEtapa()
    {
        return $this->hasMany(UbicacionEtapa::class, 'id_etapa');
    }
}
