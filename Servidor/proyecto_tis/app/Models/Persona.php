<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Persona extends Model
{
    public $timestamps = false;
    protected $table = 'persona';
    protected $primaryKey = 'id_persona';
    public $incrementing = true;
    use HasFactory;
    use Notifiable;
    
    public function RolPersona() {
        return $this->hasMany(RolPersona::class, 'id_persona');
    }

    public function routeNotificationForMail()
    {
        return $this->correo_electronico; 
    }
}
