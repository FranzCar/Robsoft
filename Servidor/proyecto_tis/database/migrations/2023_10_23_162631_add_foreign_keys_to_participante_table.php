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
        Schema::table('participante', function (Blueprint $table) {
            $table->foreign(['id_persona'], 'participante_ibfk_1')->references(['id_persona'])->on('persona');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('participante', function (Blueprint $table) {
            $table->dropForeign('participante_ibfk_1');
        });
    }
};
