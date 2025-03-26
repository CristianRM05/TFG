<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);      // Listar productos
    Route::get('/{id}', [ProductController::class, 'show']);   // Mostrar un solo producto


        Route::post('/', [ProductController::class, 'store']);     // Crear producto
        Route::put('/{id}', [ProductController::class, 'update']); // Actualizar producto
        Route::delete('/{id}', [ProductController::class, 'destroy']); // Eliminar producto

});
