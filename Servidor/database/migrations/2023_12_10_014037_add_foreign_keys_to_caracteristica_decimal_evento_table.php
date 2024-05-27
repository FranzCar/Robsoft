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
        Schema::table('caracteristica_decimal_evento', function (Blueprint $table) {
            $table->foreign(['id_evento'], 'caracteristica_decimal_evento_ibfk_2')->references(['id_evento'])->on('evento');
            $table->foreign(['id_caracteristica_evento'], 'caracteristica_decimal_evento_ibfk_1')->references(['id_caracteristica_evento'])->on('caracteristicas_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('caracteristica_decimal_evento', function (Blueprint $table) {
            $table->dropForeign('caracteristica_decimal_evento_ibfk_2');
            $table->dropForeign('caracteristica_decimal_evento_ibfk_1');
        });
    }
};
