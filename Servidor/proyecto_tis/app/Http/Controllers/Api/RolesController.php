<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Tareas;

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
        foreach ($request->all() as $rolData) {
            $rol = Roles::findOrFail($rolData['id_roles']);
            $rol->tareas()->sync($rolData['tareas']);
        }
    
        return response()->json(['message' => 'Tareas de todos los roles actualizadas con éxito.']);
    }
}
