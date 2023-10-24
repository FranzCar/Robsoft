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
            $table->string('nombre', 60)->nullable();
            $table->string('correo_electronico', 30)->nullable();
            $table->string('telefono', 10)->nullable();
            $table->string('ci', 10)->nullable();
            $table->string('genero', 9)->nullable();
            $table->integer('rol_persona')->nullable();
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
