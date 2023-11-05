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
        Schema::create('inscripcion', function (Blueprint $table) {
            $table->integer('id_inscripcion', true);
            $table->integer('puntaje')->nullable();
            $table->integer('clasificacion')->nullable();
            $table->integer('id_equipo')->nullable()->index('id_equipo');
            $table->integer('id_rol_persona')->nullable()->index('id_rol_persona');
            $table->integer('id_evento')->nullable()->index('id_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inscripcion');
    }
};
