<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DiscountController;

Route::middleware(['auth', 'role:manager'])->prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerDashboardController::class, 'create'])->name('manager.dashboard');
    Route::post('/users', [UserController::class, 'store'])->name('manager.users.store');
    //ruta a stock
    Route::get('/stock', [ProductController::class, 'stockIndex'])->name('stock.index');


    //descuentos
    Route::prefix('discounts')->group(function () {
        Route::get('/', [DiscountController::class, 'index'])->name('discounts.index');
        Route::post('/', [DiscountController::class, 'store'])->name('discounts.store');
        Route::delete('/{product}', [DiscountController::class, 'destroy'])->name('discounts.destroy');
    });

    //estanterias
    Route::get('/shelves', [ProductController::class, 'unassignedProducts'])->name('shelves.index');


        Route::put('/products/{product}/assign-shelf', [ProductController::class, 'assignShelf'])
        ->name('products.assign-shelf');

        Route::put('/products/{product}/assign-split', [ProductController::class, 'assignSplitToShelf'])
            ->name('products.assign-split');

        Route::delete('/products/{product}/remove-merge', [ProductController::class, 'removeAndMergeFromShelf'])
            ->name('products.remove-merge');

        Route::put('/products/{product}/update-shelf', [ProductController::class, 'updateShelf'])
            ->name('products.update-shelf');


        Route::get('/shelves/{shelf}', [ProductController::class, 'showShelf'])
            ->name('shelves.show');
});
