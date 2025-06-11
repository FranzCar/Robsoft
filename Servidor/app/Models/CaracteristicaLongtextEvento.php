<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaracteristicaLongtextEvento extends Model
{
    protected $table = 'CARACTERISTICA_LONGTEXT_EVENTO';
    protected $primaryKey = 'id_clt_e';
    public $timestamps = false;
    protected $fillable = ['id_clt_e', 'valor_longtext_evento', 'id_caracteristica_evento', 'id_evento'];
    use HasFactory;
}
