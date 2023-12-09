<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Tareas;
use Illuminate\Support\Facades\DB;

class RolesController extends Controller
{
    public function listaRoles() {
        $roles = Roles::select('id_roles', 'nombre_rol')
                           ->orderBy('id_roles', 'asc')
                           ->get();

        return $roles;
    }
    public function listaTareas() {
        $tareas = Tareas::select('id_tarea', 'nombre_tarea')
                        ->orderBy('id_tarea', 'asc')
                        ->get();
    
        return $tareas;
    }
    public function listaRolesTareas() {
        $rolesConTareas = Roles::with(['tareas' => function ($query) {
                                $query->select('TAREAS.id_tarea', 'TAREAS.nombre_tarea');
                            }])
                            ->get()
                            ->each(function ($role) {
                                $role->setRelation('tareas', $role->tareas->makeHidden(['pivot']));
                            });
    
        return $rolesConTareas;
    }
    public function actualizarTareasRoles(Request $request) {
        // Comenzamos una transacción
        DB::beginTransaction();
        try {
            foreach ($request->all() as $rolData) {
                $rol = Roles::findOrFail($rolData['id_roles']);
    
                // Eliminamos todas las tareas existentes para este rol
                $rol->tareas()->detach();
    
                // Sincronizamos las tareas proporcionadas
                foreach ($rolData['tareas'] as $idTarea) {
                    $rol->tareas()->attach($idTarea);
                }
            }
    
            // Confirmamos la transacción
            DB::commit();
            return response()->json(['message' => 'Tareas de todos los roles actualizadas con éxito.']);
        } catch (\Exception $e) {
            // Si algo sale mal, revertimos la transacción
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar tareas: ' . $e->getMessage()], 500);
        }
    }
    
}
