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
        Schema::create('caracteristica_texto_persona', function (Blueprint $table) {
            $table->integer('id_ct_p', true);
            $table->string('valor_texto_persona', 50)->nullable();
            $table->integer('id_caract_per')->nullable()->index('id_caract_per');
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
        Schema::dropIfExists('caracteristica_texto_persona');
    }
};
