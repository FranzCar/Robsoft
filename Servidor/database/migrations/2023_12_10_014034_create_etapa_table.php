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
        Schema::create('etapa', function (Blueprint $table) {
            $table->integer('id_etapa', true);
            $table->string('nombre_etapa', 50)->nullable();
            $table->dateTime('fecha_hora_inicio')->nullable();
            $table->dateTime('fecha_hora_fin')->nullable();
            $table->string('modalidad_ubicacion', 50)->nullable();
            $table->string('url_etapa', 80)->nullable();
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
        Schema::dropIfExists('etapa');
    }
};
