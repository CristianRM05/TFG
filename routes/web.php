<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

});

Route::middleware(['auth'])->get('/admin/dashboard', function () {
    return Inertia::render('dashboardAdmin');
})->name('admin.dashboard');


Route::middleware(['auth'])->get('/admin/dashboard',
[AdminDashboardController::class, 'create'])->name('admin.dashboard');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
});

Route::post('/products', [ProductController::class, 'store'])->name('products.store');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
