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
        Schema::create('caracteristica_longtext_evento', function (Blueprint $table) {
            $table->longText('valor_longtext_evento')->nullable();
            $table->integer('id_caracteristica_evento')->nullable()->index('id_caracteristica_evento');
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
        Schema::dropIfExists('caracteristica_longtext_evento');
    }
};
