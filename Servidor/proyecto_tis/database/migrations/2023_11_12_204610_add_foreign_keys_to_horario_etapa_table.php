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
        Schema::table('horario_etapa', function (Blueprint $table) {
            $table->foreign(['id_etapa'], 'horario_etapa_ibfk_2')->references(['id_etapa'])->on('etapa');
            $table->foreign(['id_horario'], 'horario_etapa_ibfk_1')->references(['id_horario'])->on('horario');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('horario_etapa', function (Blueprint $table) {
            $table->dropForeign('horario_etapa_ibfk_2');
            $table->dropForeign('horario_etapa_ibfk_1');
        });
    }
};
