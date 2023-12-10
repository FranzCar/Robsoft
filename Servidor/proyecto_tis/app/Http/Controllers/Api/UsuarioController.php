<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Roles;
use App\Models\Tareas;

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

    public function obtenerTareasUsuario($idUsuario) {
        // Encuentra el usuario y carga sus roles y las tareas de esos roles
        $usuario = Usuario::with('roles.tareas')->findOrFail($idUsuario);

        // Obtén todas las tareas posibles
        $todasLasTareas = Tareas::all();

        // Obtén las IDs de las tareas del usuario
        $tareasDelUsuario = $usuario->roles->flatMap(function ($rol) {
            return $rol->tareas->pluck('id_tarea');
        })->unique();

        // Prepara el resultado final
        $tareas = $todasLasTareas->map(function ($tarea) use ($tareasDelUsuario) {
            return [
                'id_tarea' => $tarea->id_tarea,
                'nombre_tarea' => $tarea->nombre_tarea,
                'asignado' => $tareasDelUsuario->contains($tarea->id_tarea)
            ];
        });

        return response()->json($tareas);
    }
    public function obtenerRolesUsuario($idUsuario) {
        // Encuentra el usuario y carga sus roles
        $usuario = Usuario::with('roles')->findOrFail($idUsuario);

        // Obtén todas los roles posibles
        $todosLosRoles = Roles::all();

        // Obtén las IDs de los roles del usuario
        $rolesDelUsuario = $usuario->roles->pluck('id_roles')->all();

        // Prepara el resultado final
        $roles = $todosLosRoles->map(function ($rol) use ($rolesDelUsuario) {
            return [
                'id_roles' => $rol->id_roles,
                'nombre_rol' => $rol->nombre_rol,
                'asignado' => in_array($rol->id_roles, $rolesDelUsuario)
            ];
        });

        return response()->json($roles);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $user = Usuario::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'El usuario no existe'], 404);
        }

        if ($user->password !== $password) {
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }

        return response()->json(['message' => 'Autenticación exitosa']);
    }
}
