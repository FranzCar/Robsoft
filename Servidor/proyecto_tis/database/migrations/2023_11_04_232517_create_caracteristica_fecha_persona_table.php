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
        Schema::create('caracteristica_fecha_persona', function (Blueprint $table) {
            $table->date('valor_fecha_persona')->nullable();
            $table->integer('id_caracteristica_persona')->nullable()->index('id_caracteristica_persona');
            $table->integer('id_persona')->nullable()->index('id_persona');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('caracteristica_fecha_persona');
    }
};
