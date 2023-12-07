<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class CaracteristicaTextoEvento extends Model
{
    protected $table = 'CARACTERISTICA_TEXTO_EVENTO';
    protected $primaryKey = 'id_ct_e';
    public $timestamps = false;
    protected $fillable = ['id_ct_e', 'valor_texto_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
    
    public function caracteristicaEvento()
    {
        return $this->belongsTo(CaracteristicasEvento::class, 'id_caracteristica_evento');
    }
}
