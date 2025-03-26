<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\HandleCors as Middleware;

class HandleCors extends Middleware
{
    // Cambiar "*" por el origen específico de tu frontend
    protected $allowedOrigins = ['http://localhost:8001']; // Especifica tu frontend aquí

    // Si usas otros encabezados personalizados, inclúyelos aquí
    protected $allowedHeaders = ['*'];

    // Métodos permitidos
    protected $allowedMethods = ['*'];

    // Agregar credenciales
    protected $supportsCredentials = true;
}
