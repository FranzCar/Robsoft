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
        Schema::create('caracteristicas_tipo_evento', function (Blueprint $table) {
            $table->integer('id_tipo_evento')->nullable()->index('id_tipo_evento');
            $table->integer('id_caracteristica_evento')->nullable()->index('id_caracteristica_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('caracteristicas_tipo_evento');
    }
};
