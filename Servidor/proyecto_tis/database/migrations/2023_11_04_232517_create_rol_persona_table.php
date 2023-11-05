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
        Schema::create('rol_persona', function (Blueprint $table) {
            $table->integer('id_rol_persona', true);
            $table->integer('id_roles')->nullable()->index('id_roles');
            $table->integer('id_persona')->nullable()->index('id_persona');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rol_persona');
    }
};
