<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//API IMAGENES
Route::post('/subir-imagen', [ImagenController::class, 'subirImagen']);
//PRODUCTOS
Route::get('/products', [ProductController::class, 'index']);
//CARRITO
Route::get('/cart', [CartController::class, 'show'])->name('cart.show');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
Route::put('updateQuantity/{id}', [CartController::class, 'updateQuantity'])->name('cart.updateQuantity');

//ruta para redirigir a la vista de login
Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

//ruta para redirigir a la vista de registro
Route::get('/register', function () {
    return Inertia::render('Register');
})->name('register');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
