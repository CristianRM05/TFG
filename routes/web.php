<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
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

/**
 * Ruta protegida solo para administradores
 */
Route::middleware(['auth'])->get('/admin/dashboard', function () {
    return Inertia::render('dashboardAdmin'); // 👈 esto tiene que existir
})->name('admin.dashboard');

Route::get('/middleware-test', function () {
    return 'Middleware ejecutado correctamente';
})->middleware('role:Admin');


Route::middleware(['auth'])->get('/admin/dashboard', [AdminDashboardController::class, 'create'])->name('admin.dashboard');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
