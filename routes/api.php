<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Log;

Route::post('/importar-pedido', function (Request $request) {
    $apiToken = $request->bearerToken();

    if ($apiToken !== env('ALMACEN_API_TOKEN')) {
        return response()->json(['error' => 'No autorizado'], 401);
    }

    try {
        $orderData = $request->input('order');
        $itemsData = $request->input('items');

           if (Order::where('id', $orderData['id'])->exists()) {
            return response()->json(['message' => 'Pedido ya existe'], 200);
        }

        $order = Order::create([
            'id' => $orderData['id'],
            'user_id' => $orderData['user_id'] ?? null,
            'total_amount' => $orderData['total_amount'],
            'status' => $orderData['status'],
            'payment_method' => $orderData['payment_method'],
            'shipping_address' => $orderData['shipping_address'],
            'stripe_session_id' => $orderData['stripe_session_id'],
            'order_date' => now(),
            'truck_id' => null,
            'route_id' => null,
            'delivery_person_id' => null,
            'customer_id' => null,
            'scheduled_delivery_date' => null,
        ]);



        foreach ($itemsData as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json(['success' => true]);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Error interno'], 500);
    }
    $apiToken = $request->bearerToken();

    if ($apiToken !== env('ALMACEN_API_TOKEN')) {
        return response()->json(['error' => 'No autorizado'], 401);
    }

    $orderData = $request->input('order');
    $itemsData = $request->input('items');

    if (Order::where('id', $orderData['id'])->exists()) {
        return response()->json(['message' => 'Pedido ya existe'], 200);
    }

    $order = Order::create([
        'id' => $orderData['id'],
        'user_id' => $orderData['user_id'] ?? null,
        'total_amount' => $orderData['total_amount'],
        'status' => $orderData['status'],
        'payment_method' => $orderData['payment_method'],
        'shipping_address' => $orderData['shipping_address'],
        'stripe_session_id' => $orderData['stripe_session_id'],
        'order_date' => now(), // puedes adaptarlo si te lo pasan
    ]);

    foreach ($itemsData as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
        ]);
    }

    return response()->json(['success' => true]);
});

Route::prefix('products')->group(function () {


Route::get('/stock', '\App\Http\Controllers\StockController@index');Route::prefix('products')->group(function () {

    Route::get('/', [ProductController::class, 'index']);      // Listar productos
    Route::get('/{id}', [ProductController::class, 'show']);   // Mostrar un solo producto


        Route::post('/', [ProductController::class, 'store']);     // Crear producto
        Route::put('/{id}', [ProductController::class, 'update']); // Actualizar producto
        Route::delete('/{id}', [ProductController::class, 'destroy']); // Eliminar producto
        Route::get('/api/productos', [ProductController::class, 'apiList']);



});


Route::get('/categorias', [CategoryController::class, 'index']);
//descuentos
Route::prefix('api/discounts')->group(function () {
    Route::get('/products-without-discount', [DiscountController::class, 'apiProductsWithoutDiscount']);
    Route::post('/', [DiscountController::class, 'store']);
    Route::delete('/{product}', [DiscountController::class, 'destroy']);
});

}
);

