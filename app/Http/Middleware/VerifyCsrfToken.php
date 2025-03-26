<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
         // 🚨 Esto desactiva la verificación CSRF para todas las rutas (solo para desarrollo)
    ];
}
