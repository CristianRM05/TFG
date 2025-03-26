<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\VerifyCsrfToken; // Importar el middleware CSRF
use App\Http\Middleware\CorsMiddleware;  // Importar el middleware CORS

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Middleware CSRF y CORS aplicados a las rutas de productos

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
