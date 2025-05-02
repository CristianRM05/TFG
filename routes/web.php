<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\StockController;


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
Route::get('/products', action: [ProductController::class, 'index']);

//CARRITO Y COUPONS
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::put('updateQuantity/{id}', [CartController::class, 'updateQuantity'])->name('cart.updateQuantity');
    Route::post('/apply-coupon', [CouponController::class, 'apply']);
    Route::get('coupons/available ', [CouponController::class, 'getAvailableCoupons']);
});

//NEWSLETTER
Route::post('/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/manager.php';

