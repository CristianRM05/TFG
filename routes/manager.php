<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AnalyticsController;


Route::middleware(['auth', 'role:manager,admin'])->prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerDashboardController::class, 'create'])->name('manager.dashboard');
    //ruta a stock y productos
    Route::get('/stock', [ProductController::class, 'stockIndex'])->name('stock.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

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


    //pedidos
    Route::get('/orders', [OrderController::class, 'managerOrders'])
        ->name('orders.manager');

    Route::put('/orders/{id}/assign', [OrderController::class, 'assignOrder'])
        ->name('orders.assign');

});

    // Movimientos
    Route::prefix('manager')
     ->name('manager.')
     ->middleware(['auth','role:manager,admin'])
     ->group(function(){
         // …
         Route::get('/movimientos', [AnalyticsController::class,'index'])
              ->name('movimientos.index');
     });
