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
        Schema::create('rol_persona_equipo', function (Blueprint $table) {
            $table->integer('id_rol_persona')->nullable()->index('id_rol_persona');
            $table->integer('id_equipo')->nullable()->index('id_equipo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rol_persona_equipo');
    }
};
