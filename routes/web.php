<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Backoffice\OrderController;
use App\Http\Controllers\Backoffice\RouteController;
use App\Http\Middleware\VerifyCsrfToken;
use App\Http\Middleware\CorsMiddleware;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');

});

/**
 * Ruta protegida solo para administradores
 */
Route::middleware(['auth'])->get('/admin/dashboard', function () {
    return Inertia::render('dashboardAdmin');
})->name('admin.dashboard');

Route::get('/middleware-test', function () {
    return 'Middleware ejecutado correctamente';
})->middleware('role:Admin');


Route::middleware(['auth'])->get('/admin/dashboard', [AdminDashboardController::class, 'create'])->name('admin.dashboard');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
});
Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');


//para consumir los datos de la base de datos
Route::middleware(['auth'])->group(function () {
    Route::get('/api/productos', [ProductController::class, 'index']);
});

//devuelve a una vista
Route::middleware(['auth', 'verified'])->get('/almacen/productos', function () {
    return Inertia::render('ManagerPages/listProducts');
})->name('almacen.productos');



//BackOfice
// Ruta para renderizar la vista de pedidos pendientes (BackOffice)
Route::middleware(['auth', 'role:Manager'])->get('/orders', function () {
    return Inertia::render('ManagerPage/backOffice');
});

// API de pedidos para React
Route::prefix('backoffice')->middleware(['auth', 'role:Manager'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/assign', [OrderController::class, 'assign']);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
