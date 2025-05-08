<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NewsletterController;
use App\Models\User;
use App\Http\Controllers\ProductController;


Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Ruta existente del dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'create'])->name('admin.dashboard');

    Route::get('/users', function () {
        $users = User::paginate(10); // 10 usuarios por página

        return response()->json([
            'success' => true,
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total()
            ]
        ]);
    })->name('admin.users.index');

    // Otras rutas existentes
    Route::post('/create-coupon', [CouponController::class, 'store']);
    Route::post('/send-newsletter', [NewsletterController::class, 'send']);
    Route::patch('/users/{user}/ban', [AdminDashboardController::class, 'banUser'])
        ->name('admin.users.ban');

    //CATEGORIAS, PRODUCTOS Y ESTANTERIAS
    Route::get('/products/categorias', [ProductController::class, 'getCategorias']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/shelves', [AdminDashboardController::class, 'storeShelf'])
        ->name('admin.shelves.store');

});
