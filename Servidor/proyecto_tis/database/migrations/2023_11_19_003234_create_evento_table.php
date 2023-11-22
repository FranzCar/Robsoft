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
        Schema::create('evento', function (Blueprint $table) {
            $table->integer('id_evento', true);
            $table->string('TITULO', 80)->nullable();
            $table->string('ESTADO', 30)->nullable()->default('En espera');
            $table->date('FECHA_INICIO')->nullable();
            $table->date('FECHA_FIN')->nullable();
            $table->string('DESCRIPCION', 350)->nullable();
            $table->boolean('MOSTRAR')->default(true);
            $table->longText('AFICHE')->nullable();
            $table->integer('id_tipo_evento')->nullable()->index('id_tipo_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evento');
    }
};
