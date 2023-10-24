<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `EventosMostrar`()
BEGIN
    SELECT * FROM eventos 
    WHERE MOSTRAR = 1
    ORDER BY TITULO ASC, TIPO_EVENTO ASC, ESTADO ASC, FECHA DESC;
END");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS EventosMostrar");
    }
};
