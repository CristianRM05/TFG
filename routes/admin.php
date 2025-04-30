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
    
    Route::get('/users', function () {
    $users = User::paginate(10); // 10 usuarios por página
    
    return response()->json([
        'success' => true,
        'users' => $users->items(), // Los usuarios de la página actual
        'pagination' => [
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total()
        ]
    ]);
})->name('admin.users.index');
    
    // Ruta existente para crear usuarios (POST)
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    
    // Otras rutas existentes
    Route::post('/create-coupon', [CouponController::class, 'store']);
    Route::post('/send-newsletter', [NewsletterController::class, 'send']);
});