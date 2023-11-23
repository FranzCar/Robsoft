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
        Schema::create('evento_auspiciador', function (Blueprint $table) {
            $table->integer('id_evento');
            $table->integer('id_auspiciador')->index('id_auspiciador');

            $table->primary(['id_evento', 'id_auspiciador']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evento_auspiciador');
    }
};
