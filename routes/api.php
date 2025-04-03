<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\CategoryController;
Route::prefix('products')->group(function () {

use App\Http\Controllers\StockController;

Route::get('/stock', '\App\Http\Controllers\StockController@index');Route::prefix('products')->group(function () {

    Route::get('/', [ProductController::class, 'index']);      // Listar productos
    Route::get('/{id}', [ProductController::class, 'show']);   // Mostrar un solo producto


        Route::post('/', [ProductController::class, 'store']);     // Crear producto
        Route::put('/{id}', [ProductController::class, 'update']); // Actualizar producto
        Route::delete('/{id}', [ProductController::class, 'destroy']); // Eliminar producto
        Route::get('/api/productos', [ProductController::class, 'apiList']);



});
Route::get('/categorias', [CategoryController::class, 'index']);


}
);

