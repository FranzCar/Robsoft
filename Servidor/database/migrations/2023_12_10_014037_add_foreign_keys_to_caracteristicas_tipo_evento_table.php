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
        Schema::table('caracteristicas_tipo_evento', function (Blueprint $table) {
            $table->foreign(['id_caracteristica_evento'], 'caracteristicas_tipo_evento_ibfk_2')->references(['id_caracteristica_evento'])->on('caracteristicas_evento');
            $table->foreign(['id_tipo_evento'], 'caracteristicas_tipo_evento_ibfk_1')->references(['id_tipo_evento'])->on('tipo_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('caracteristicas_tipo_evento', function (Blueprint $table) {
            $table->dropForeign('caracteristicas_tipo_evento_ibfk_2');
            $table->dropForeign('caracteristicas_tipo_evento_ibfk_1');
        });
    }
};
