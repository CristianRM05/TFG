<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    public function handle(Request $request, Closure $next, string ...$roles)
: Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $userRole = strtolower($user->role->value ?? ''); //  Pasamos a minúsculas
$allowedRoles = array_map('strtolower', $roles);
    \Log::info("User Role: {$userRole}, Allowed Roles: " . json_encode($allowedRoles));

        if (!in_array($userRole, $allowedRoles)) {
            if ($request->header('X-Inertia')) {
                return response()->json([
                    'component' => 'Errors/403'
                ], 403);
            }

            abort(403, 'No tienes permiso para acceder a esta ruta :(');
        }

        return $next($request);
    }
}
