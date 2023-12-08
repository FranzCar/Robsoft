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
        Schema::table('usuario_roles', function (Blueprint $table) {
            $table->foreign(['id_usuario'], 'usuario_roles_ibfk_1')->references(['id_usuario'])->on('usuario');
            $table->foreign(['id_roles'], 'usuario_roles_ibfk_2')->references(['id_roles'])->on('roles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('usuario_roles', function (Blueprint $table) {
            $table->dropForeign('usuario_roles_ibfk_1');
            $table->dropForeign('usuario_roles_ibfk_2');
        });
    }
};
