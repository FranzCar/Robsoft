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
        Schema::table('codigos_verificacion', function (Blueprint $table) {
            $table->foreign(['id_evento'], 'codigos_verificacion_ibfk_1')->references(['id_evento'])->on('evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('codigos_verificacion', function (Blueprint $table) {
            $table->dropForeign('codigos_verificacion_ibfk_1');
        });
    }
};
