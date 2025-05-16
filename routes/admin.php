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
        $users = User::paginate(5); 

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

    Route::get('/shelves', function (\Illuminate\Http\Request $request) {
        $perPage = $request->input('per_page', 10);
        $shelves = \App\Models\Shelf::with('products')->paginate($perPage);

        $shelvesData = $shelves->getCollection()->map(function ($shelf) {
            return [
                'id' => $shelf->id,
                'code' => $shelf->code,
                'location' => $shelf->location,
                'max_capacity' => $shelf->max_capacity,
                'created_at' => $shelf->created_at,
                'updated_at' => $shelf->updated_at,
                'products' => $shelf->products,
            ];
        });

        return response()->json([
            'success' => true,
            'shelves' => $shelvesData,
            'pagination' => [
                'current_page' => $shelves->currentPage(),
                'last_page' => $shelves->lastPage(),
                'per_page' => $shelves->perPage(),
                'total' => $shelves->total(),
            ]
        ]);
    })->name('admin.shelves.index');

    // Ruta para productos - EXACTAMENTE IGUAL QUE USUARIOS
    Route::get('/products', function (\Illuminate\Http\Request $request) {
        $perPage = $request->input('per_page', 10);
        $products = \App\Models\Product::with('shelf')->paginate($perPage);

        $productsData = $products->getCollection()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'num_reference' => $product->num_reference,
                'stock' => $product->stock,
                'price' => $product->price,
                'discount_percent' => $product->discount_percent,
                'final_price' => $product->final_price,
                'categoria' => $product->categoria,
                'shelf_id' => $product->shelf_id,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'image_url' => $product->image_url,
                'shelf' => $product->shelf,
            ];
        });

        return response()->json([
            'success' => true,
            'products' => $productsData,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
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
