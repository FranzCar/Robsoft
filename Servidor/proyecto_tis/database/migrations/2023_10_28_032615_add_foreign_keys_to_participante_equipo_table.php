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
        Schema::table('participante_equipo', function (Blueprint $table) {
            $table->foreign(['id_participante'], 'participante_equipo_ibfk_1')->references(['id_persona'])->on('participante');
            $table->foreign(['id_equipo'], 'participante_equipo_ibfk_2')->references(['id_equipo'])->on('equipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('participante_equipo', function (Blueprint $table) {
            $table->dropForeign('participante_equipo_ibfk_1');
            $table->dropForeign('participante_equipo_ibfk_2');
        });
    }
};
