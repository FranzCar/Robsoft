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
        Schema::create('eventos', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('TITULO', 30)->nullable();
            $table->string('TIPO_EVENTO', 35)->nullable();
            $table->string('ESTADO', 30)->nullable()->default('En espera');
            $table->date('FECHA')->nullable();
            $table->time('HORA')->nullable();
            $table->string('UBICACION', 30)->nullable();
            $table->string('DESCRIPCION', 350)->nullable();
            $table->string('ORGANIZADOR', 30)->nullable();
            $table->string('PATROCINADOR', 30)->nullable();
            $table->boolean('MOSTRAR')->default(true);
            $table->longText('AFICHE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('eventos');
    }
};
