<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\User;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\VerifyCsrfToken;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Controllers\BackOffice\OrderController;
use App\Http\Controllers\BackOffice\RouteController;
use App\Http\Controllers\TruckController;
use App\Http\Controllers\ManagerDashboardController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';