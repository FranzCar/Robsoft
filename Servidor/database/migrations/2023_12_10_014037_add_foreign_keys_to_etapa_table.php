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
        Schema::table('etapa', function (Blueprint $table) {
            $table->foreign(['id_evento'], 'etapa_ibfk_1')->references(['id_evento'])->on('evento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('etapa', function (Blueprint $table) {
            $table->dropForeign('etapa_ibfk_1');
        });
    }
};
