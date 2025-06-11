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
        Schema::table('rol_persona', function (Blueprint $table) {
            $table->foreign(['id_persona'], 'rol_persona_ibfk_2')->references(['id_persona'])->on('persona');
            $table->foreign(['id_roles'], 'rol_persona_ibfk_1')->references(['id_roles'])->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rol_persona', function (Blueprint $table) {
            $table->dropForeign('rol_persona_ibfk_2');
            $table->dropForeign('rol_persona_ibfk_1');
        });
    }
};
