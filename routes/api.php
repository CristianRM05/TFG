<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);      
    Route::get('/{id}', [ProductController::class, 'show']);


        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);

});
Route::get('/categorias', [CategoryController::class, 'index']);
