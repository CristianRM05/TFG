<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\NewsletterController;
use App\Models\User;
use App\Models\Shelf;
use App\Models\Categoria;
use App\Models\Product;
use App\Http\Controllers\ProductController;


Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Ruta  del dashboard
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
    
    // Ruta para estanterías - EXACTAMENTE IGUAL QUE USUARIOS
    Route::get('/shelves', function () {
        $shelves = \App\Models\Shelf::all()->map(function ($shelf) {
            return [
                'id' => $shelf->id,
                'code' => $shelf->code,
                'location' => $shelf->location,
                'max_capacity' => $shelf->max_capacity,
                'created_at' => $shelf->created_at, // <-- Añade esto
                'updated_at' => $shelf->updated_at, // (opcional)
                'products' => $shelf->products,     // si lo necesitas
            ];
        });    
        return response()->json([
            'success' => true,
            'shelves' => $shelves,
            'total' => $shelves->count()
        ]);
    })->name('admin.shelves.index');
    
    // Ruta para productos - EXACTAMENTE IGUAL QUE USUARIOS
    Route::get('/products', function () {
        $products = Product::all(); // Puedes usar paginate(10) si quieres paginación
    
        return response()->json([
            'success' => true,
            'products' => $products,
            'total' => $products->count()
        ]);
    })->name('admin.products.index');
    
    // Ruta para categorías
    Route::get('/categorias', function () {
        $categorias = Categoria::all();
        
        return response()->json([
            'success' => true,
            'categorias' => $categorias
        ]);
    })->name('admin.categorias.index');
    

    // Otras rutas existentes
    Route::post('/create-coupon', [CouponController::class, 'store']);
    Route::post('/send-newsletter', [NewsletterController::class, 'send']);
    //ruta para banear users
    Route::patch('/users/{user}/ban', [AdminDashboardController::class, 'banUser'])
        ->name('admin.users.ban');
        //ruta para borrar shelves
    Route::delete('/shelves/{shelf}', [AdminDashboardController::class, 'deleteShelf'])
        ->name('admin.shelves.delete');
        
    //ruta para borrar products
    Route::delete('/products/{product}', [AdminDashboardController::class, 'deleteProduct'])
        ->name('admin.products.delete');


    //CATEGORIAS, PRODUCTOS Y ESTANTERIAS
    Route::get('/products/categorias', [ProductController::class, 'getCategorias']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/shelves', [AdminDashboardController::class, 'storeShelf'])
        ->name('admin.shelves.store');

});
