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
        Schema::table('evento_auspiciador', function (Blueprint $table) {
            $table->foreign(['id_evento'], 'evento_auspiciador_ibfk_1')->references(['id_evento'])->on('evento');
            $table->foreign(['id_auspiciador'], 'evento_auspiciador_ibfk_2')->references(['id_auspiciador'])->on('auspiciador');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evento_auspiciador', function (Blueprint $table) {
            $table->dropForeign('evento_auspiciador_ibfk_1');
            $table->dropForeign('evento_auspiciador_ibfk_2');
        });
    }
};
