<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Roles;
use App\Models\Tareas;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function obtenerTareasUsuario($id)
    {
        $tareas = Cache::remember("tareas_usuario_{$id}", 60, function () use ($id) {
            // Consulta a la base de datos para obtener las tareas del usuario
            return DB::table('usuario_roles')
                ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
                ->join('roles_tareas', 'roles.id', '=', 'roles_tareas.rol_id')
                ->join('tareas', 'roles_tareas.tarea_id', '=', 'tareas.id')
                ->where('usuario_roles.usuario_id', $id)
                ->pluck('tareas.nombre');
        });

        return response()->json($tareas);
    }

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
    \Log::info('Login request received', $request->all());

    $request->validate([
        'username' => 'required',
        'password' => 'required'
    ]);

    $credentials = $request->only('username', 'password');

    \Log::info('Attempting login for username', ['username' => $credentials['username']]);

    $authAttempt = Auth::attempt($credentials);
    \Log::info('Auth attempt result', ['result' => $authAttempt]);

    if ($authAttempt) {
        $user = Auth::user();
        \Log::info('Authentication successful', ['user_id' => $user->id_usuario]);

        $token = $user->createToken('authToken')->accessToken;

        return response()->json(['token' => $token, 'user' => $user]);
    } else {
        \Log::warning('Authentication failed', ['username' => $credentials['username']]);

        return response()->json(['error' => 'Unauthorised'], 401);
    }
}
    public function crearUsuario(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validatedData = $request->validate([
                'username' => 'required|unique:usuario,username', // Asegúrate de que el nombre de usuario sea único
                'password' => 'required|min:6', // La contraseña debe tener al menos 6 caracteres
                'id_roles' => 'required|exists:roles,id_roles' 
            ]);

            // Crear un nuevo usuario
            $usuario = new Usuario();
            $usuario->username = $validatedData['username'];
            $usuario->password = Hash::make($validatedData['password']); // Cifrar la contraseña
            $usuario->api_token = Str::random(80); // Generar un token API aleatorio

            // Guardar el usuario
            $usuario->save();

            // Asignar el rol al usuario
            $usuario->roles()->attach($validatedData['id_roles']);

            // Devolver una respuesta
            return response()->json([
                'message' => 'Usuario creado con éxito',
                'id_usuario' => $usuario->id_usuario,
                'api_token' => $usuario->api_token,
                'id_roles' => $validatedData['id_roles']
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Devolver una respuesta de error en caso de fallar la validación
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Manejar otras excepciones
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
