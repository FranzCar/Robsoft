<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rol_persona_equipo', function (Blueprint $table) {
            $table->foreign(['id_rol_persona'], 'rol_persona_equipo_ibfk_1')->references(['id_rol_persona'])->on('rol_persona');
            $table->foreign(['id_equipo'], 'rol_persona_equipo_ibfk_2')->references(['id_equipo'])->on('equipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rol_persona_equipo', function (Blueprint $table) {
            $table->dropForeign('rol_persona_equipo_ibfk_1');
            $table->dropForeign('rol_persona_equipo_ibfk_2');
        });
    }
};
