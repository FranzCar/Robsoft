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
    SELECT * FROM TIPO_EVENTO as te
    JOIN evento as e ON te.id_tipo_evento = e.id_tipo_evento
    WHERE MOSTRAR = 1 AND ESTADO = 'En espera'
    ORDER BY e.TITULO ASC, te.nombre_tipo_evento ASC, e.ESTADO ASC;
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
