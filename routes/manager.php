<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;

Route::middleware(['auth', 'role:manager'])->prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerDashboardController::class, 'create'])->name('manager.dashboard');
    Route::post('/users', [UserController::class, 'store'])->name('manager.users.store');
    //ruta a stock
    Route::get('/stock', [StockController::class, 'index'])
              ->name('stock.index');


});
