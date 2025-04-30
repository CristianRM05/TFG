<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NewsletterController;
use App\Models\User;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Ruta existente del dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'create'])->name('admin.dashboard');
    
    // Nueva ruta para obtener usuarios (GET)
    Route::get('/users', function () {
        return response()->json(User::all());
    })->name('admin.users.index');
    
    // Ruta existente para crear usuarios (POST)
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    
    // Otras rutas existentes
    Route::post('/create-coupon', [CouponController::class, 'store']);
    Route::post('/send-newsletter', [NewsletterController::class, 'send']);
});