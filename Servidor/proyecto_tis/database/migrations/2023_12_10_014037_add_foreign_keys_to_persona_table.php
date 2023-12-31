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
        Schema::table('persona', function (Blueprint $table) {
            $table->foreign(['id_institucion'], 'persona_ibfk_2')->references(['id_institucion'])->on('institucion');
            $table->foreign(['id_tipo_per'], 'persona_ibfk_1')->references(['id_tipo_per'])->on('tipo_persona');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('persona', function (Blueprint $table) {
            $table->dropForeign('persona_ibfk_2');
            $table->dropForeign('persona_ibfk_1');
        });
    }
};
