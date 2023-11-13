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
        Schema::table('disponibilidad', function (Blueprint $table) {
            $table->foreign(['id_ubicacion'], 'disponibilidad_ibfk_2')->references(['id_ubicacion'])->on('ubicacion');
            $table->foreign(['id_horario'], 'disponibilidad_ibfk_1')->references(['id_horario'])->on('horario');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('disponibilidad', function (Blueprint $table) {
            $table->dropForeign('disponibilidad_ibfk_2');
            $table->dropForeign('disponibilidad_ibfk_1');
        });
    }
};
