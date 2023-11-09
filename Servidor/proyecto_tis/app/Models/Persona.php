<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    public $timestamps = false;
    protected $table = 'persona';
    protected $primaryKey = 'id_persona';
    public $incrementing = true;
    use HasFactory;
    
    public function RolPersona() {
        return $this->hasMany(RolPersona::class, 'id_persona');
    }
}
