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
    SELECT * FROM TIPO_EVENTO as te
    JOIN evento as e ON te.id_tipo_evento = e.id_tipo_evento
    WHERE MOSTRAR = 1
    ORDER BY e.id_evento DESC;
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
