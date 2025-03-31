<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AdminDashboardController,
    ManagerDashboardController,
    UserController,
    ProductController
};

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas autenticadas comunes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Cambia esta ruta para usar ProductController
    Route::get('/stock', [ProductController::class, 'stockIndex'])->name('stock.index');
    
    Route::get('/shelves', [ProductController::class, 'unassignedProducts'])->name('shelves.index'); 
});

// Rutas de administrador
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'create'])->name('admin.dashboard');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
});

// Rutas de manager
Route::middleware(['auth'])->prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerDashboardController::class, 'create'])->name('manager.dashboard');
    Route::post('/users', [UserController::class, 'store'])->name('manager.users.store');
});

// Rutas de gestión de productos y estanterías
Route::middleware(['auth'])->group(function () {
    Route::post('/products/{product}/assign-shelf', [ProductController::class, 'assignShelf'])
        ->name('products.assign-shelf');
    
    Route::get('/shelves/{shelf}', [ProductController::class, 'showShelf'])
        ->name('shelves.show');
});

// Middleware test (puedes mantenerlo o eliminar si es solo para pruebas)
Route::get('/middleware-test', function () {
    return 'Middleware ejecutado correctamente';
})->middleware('role:Admin,Manager'); // Combinado para ambos roles

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';