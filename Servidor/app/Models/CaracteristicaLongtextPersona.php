<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaLongtextPersona extends Model
{
    protected $table = 'CARACTERISTICA_LONGTEXT_PERSONA';
    protected $primaryKey = 'id_clt_p';
    protected $fillable = ['id_clt_p', 'valor_longtext_persona', 'id_caract_per', 'id_persona'];
    public $timestamps = false;
    use HasFactory;
}
