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
        Schema::create('participante', function (Blueprint $table) {
            $table->integer('id_persona')->primary();
            $table->date('fechaNacimiento')->nullable();
            $table->string('talla_polera', 10)->nullable();
            $table->longText('foto')->nullable();
            $table->longText('certificado')->nullable();
            $table->integer('codigoSIS')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('participante');
    }
};
