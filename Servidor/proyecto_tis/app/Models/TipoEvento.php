<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoEvento extends Model
{
    public $timestamps = false;
    protected $table = 'TIPO_EVENTO';
    protected $primaryKey = 'id_tipo_evento';
    use HasFactory;
}
