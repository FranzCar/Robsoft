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
        Schema::table('ubicacion_etapa', function (Blueprint $table) {
            $table->foreign(['id_etapa'], 'ubicacion_etapa_ibfk_2')->references(['id_etapa'])->on('etapa');
            $table->foreign(['id_ubicacion'], 'ubicacion_etapa_ibfk_1')->references(['id_ubicacion'])->on('ubicacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ubicacion_etapa', function (Blueprint $table) {
            $table->dropForeign('ubicacion_etapa_ibfk_2');
            $table->dropForeign('ubicacion_etapa_ibfk_1');
        });
    }
};
