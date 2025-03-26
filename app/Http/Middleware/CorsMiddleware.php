<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Permitir acceso desde el frontend (React)
        if ($request->hasHeader('Origin') && $request->header('Origin') === 'http://127.0.0.1:8001') {
            header('Access-Control-Allow-Origin: http://127.0.0.1:8001');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-TOKEN, X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
        }

        // Responder directamente a las solicitudes OPTIONS (preflight)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json('OK', 200);
        }

        return $next($request);
    }
}
