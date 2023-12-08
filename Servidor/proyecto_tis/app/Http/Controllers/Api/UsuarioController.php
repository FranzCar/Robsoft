<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;

class UsuarioController extends Controller
{
    public function listaUsuarios() {
        $usuarios = Usuario::select('id_usuario', 'username')
                           ->orderBy('id_usuario', 'asc')
                           ->get();

        return $usuarios;
    }

    public function asignarRoles(Request $request) {
        $this->validate($request, [
            'id_usuario' => 'required|exists:USUARIO,id_usuario',
            'roles' => 'required|array',
            'roles.*' => 'exists:ROLES,id_roles'
        ]);

        $usuario = Usuario::findOrFail($request->id_usuario);
        $usuario->roles()->sync($request->roles);

        return response()->json(['message' => 'Roles asignados con éxito al usuario.']);
    }
}
