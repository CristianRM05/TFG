<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyCsrfToken
{
    /**
     * Las rutas que deben excluirse de la verificación CSRF.
     *
     * @var array
     */
    protected $except = [
        '/*', // Excluir todas las rutas bajo '/api/' (para Postman)
        '/products/crear',
    ];

    /**
     * Manejar la solicitud entrante.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si la ruta está en la lista de excepciones, se omite la verificación CSRF
        foreach ($this->except as $except) {
            if ($request->is($except)) {
                return $next($request);
            }
        }

        // Verificar el token CSRF
        if ($request->method() !== 'GET' && session()->token() !== $request->header('X-CSRF-TOKEN')) {
            return response()->json(['error' => 'Token CSRF inválido.'], 419);
        }

        return $next($request);
    }
}
