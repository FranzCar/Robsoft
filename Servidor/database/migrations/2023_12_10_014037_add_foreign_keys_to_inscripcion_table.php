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
        Schema::table('inscripcion', function (Blueprint $table) {
            $table->foreign(['id_equipo'], 'inscripcion_ibfk_2')->references(['id_equipo'])->on('equipo');
            $table->foreign(['id_rol_persona'], 'inscripcion_ibfk_1')->references(['id_rol_persona'])->on('rol_persona');
            $table->foreign(['id_evento'], 'inscripcion_ibfk_3')->references(['id_evento'])->on('evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inscripcion', function (Blueprint $table) {
            $table->dropForeign('inscripcion_ibfk_2');
            $table->dropForeign('inscripcion_ibfk_1');
            $table->dropForeign('inscripcion_ibfk_3');
        });
    }
};
