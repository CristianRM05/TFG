<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CheckoutSuccessController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DeliveryNoteController;

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

//CARRITO, COUPONS Y PEDIDOS
Route::middleware(['auth', 'verified'])->group(function () {
    //carrito
    Route::get('/cart', [CartController::class, 'show'])->name('cart.show');
    Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::put('updateQuantity/{id}', [CartController::class, 'updateQuantity'])->name('cart.updateQuantity');
    //cupones
    Route::post('/apply-coupon', [CouponController::class, 'apply']);
    Route::get('coupons/available ', [CouponController::class, 'getAvailableCoupons']);
    //checkout stock
    Route::post('/checkout', [OrderController::class, 'checkout'])->name('checkout');
    Route::get('/checkout/success', CheckoutSuccessController::class)->name('checkout.success');
    //mis pedidos
    Route::get('/my-orders', [OrderController::class, 'myOrders'])->name('orders.my');
});

//NEWSLETTER
Route::post('/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

//PEDIDOS
Route::post('/checkout', action: [OrderController::class, 'checkout'])->name('checkout');
Route::get('/checkout/success', CheckoutSuccessController::class)->name('checkout.success');
Route::get('/my-orders', [OrderController::class, 'myOrders'])->name('orders.my');

Route::patch('/products/{product}/toggle-visibility', [ProductController::class, 'toggleVisibility'])
    ->middleware(['auth', 'role:manager,admin'])
    ->name('products.toggle-visibility');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/manager.php';
