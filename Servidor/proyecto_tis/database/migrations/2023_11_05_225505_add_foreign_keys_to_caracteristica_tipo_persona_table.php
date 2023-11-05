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
        Schema::table('caracteristica_tipo_persona', function (Blueprint $table) {
            $table->foreign(['id_tipo_persona'], 'caracteristica_tipo_persona_ibfk_2')->references(['id_tipo_persona'])->on('tipo_persona');
            $table->foreign(['id_caract_per'], 'caracteristica_tipo_persona_ibfk_1')->references(['id_caract_per'])->on('caracteristica_persona');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('caracteristica_tipo_persona', function (Blueprint $table) {
            $table->dropForeign('caracteristica_tipo_persona_ibfk_2');
            $table->dropForeign('caracteristica_tipo_persona_ibfk_1');
        });
    }
};
