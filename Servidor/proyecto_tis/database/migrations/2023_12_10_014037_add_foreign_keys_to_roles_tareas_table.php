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
        Schema::table('roles_tareas', function (Blueprint $table) {
            $table->foreign(['id_roles'], 'roles_tareas_ibfk_2')->references(['id_roles'])->on('roles');
            $table->foreign(['id_tarea'], 'roles_tareas_ibfk_1')->references(['id_tarea'])->on('tareas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles_tareas', function (Blueprint $table) {
            $table->dropForeign('roles_tareas_ibfk_2');
            $table->dropForeign('roles_tareas_ibfk_1');
        });
    }
};
