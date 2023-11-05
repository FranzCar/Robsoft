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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `mostrarRolOrganizador`()
BEGIN
    SELECT RP.id_rol_persona, P.nombre, P.ci 
    FROM ROL_PERSONA as RP, PERSONA as P WHERE id_roles = 5 and RP.id_persona=P.id_persona;
END");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS mostrarRolOrganizador");
    }
};
