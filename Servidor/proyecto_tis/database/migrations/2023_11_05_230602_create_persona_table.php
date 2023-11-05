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
        Schema::create('persona', function (Blueprint $table) {
            $table->integer('id_persona', true);
            $table->string('nombre', 50)->nullable();
            $table->string('correo_electronico', 100)->nullable();
            $table->string('telefono', 12)->nullable();
            $table->string('ci', 12)->nullable();
            $table->string('genero', 9)->nullable();
            $table->integer('id_tipo_per')->nullable()->index('id_tipo_per');
            $table->integer('id_institucion')->nullable()->index('id_institucion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('persona');
    }
};
