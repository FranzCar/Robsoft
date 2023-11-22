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
        Schema::create('caracteristica_tipo_persona', function (Blueprint $table) {
            $table->integer('id_caract_per');
            $table->integer('id_tipo_per')->index('id_tipo_per');

            $table->primary(['id_caract_per', 'id_tipo_per']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('caracteristica_tipo_persona');
    }
};
