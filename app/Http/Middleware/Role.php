<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Maneja una solicitud entrante según uno o varios roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles  Roles separados por coma (ej: Manager,Admin)
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->role->value ?? null;

        $allowedRoles = explode(',', $roles);

        if (!in_array($userRole, $allowedRoles)) {
            abort(403, 'No tienes permiso para acceder a esta ruta.');
        }

        return $next($request);
    }
}
