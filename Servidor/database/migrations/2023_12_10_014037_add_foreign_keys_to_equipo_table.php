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
        Schema::table('equipo', function (Blueprint $table) {
            $table->foreign(['id_institucion'], 'equipo_ibfk_1')->references(['id_institucion'])->on('institucion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('equipo', function (Blueprint $table) {
            $table->dropForeign('equipo_ibfk_1');
        });
    }
};
