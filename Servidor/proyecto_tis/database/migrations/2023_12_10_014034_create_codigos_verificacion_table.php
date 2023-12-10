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
        Schema::create('codigos_verificacion', function (Blueprint $table) {
            $table->integer('id_codigo', true);
            $table->string('codigo', 6)->nullable();
            $table->boolean('confirmado')->nullable()->default(false);
            $table->dateTime('expiracion')->nullable();
            $table->string('uuid', 36)->nullable();
            $table->integer('id_evento')->nullable()->index('id_evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('codigos_verificacion');
    }
};
