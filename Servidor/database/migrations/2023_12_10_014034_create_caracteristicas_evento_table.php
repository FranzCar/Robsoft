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
        Schema::create('caracteristicas_evento', function (Blueprint $table) {
            $table->integer('id_caracteristica_evento', true);
            $table->string('nombre_caracteristica_evento', 50)->nullable();
            $table->string('tipo_dato_caracteristica_evento', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('caracteristicas_evento');
    }
};
