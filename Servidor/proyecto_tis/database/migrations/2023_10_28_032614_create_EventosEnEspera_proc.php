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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `EventosEnEspera`()
BEGIN
    SELECT * FROM eventos 
    WHERE MOSTRAR = 0 AND ESTADO = 'En espera'
    ORDER BY TITULO ASC, TIPO_EVENTO ASC, ESTADO ASC;
END");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS EventosEnEspera");
    }
};
