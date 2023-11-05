<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $primaryKey = 'id_evento';
    public $incrementing = true;
    protected $table = 'evento';
    public $timestamps = false;
    use HasFactory;
}
