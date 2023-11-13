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
        Schema::create('disponibilidad', function (Blueprint $table) {
            $table->string('Ocupacion', 20)->nullable();
            $table->date('fecha_ocupacion')->nullable();
            $table->integer('id_horario')->nullable()->index('id_horario');
            $table->integer('id_ubicacion')->nullable()->index('id_ubicacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('disponibilidad');
    }
};
