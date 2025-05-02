<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        // Buscar carrito activo o crearlo si no existe
        $cart = $user->cart()->firstOrCreate([
            'status' => 'active'
        ]);

        // Cargar productos relacionados
        $cart->load('items.product');

        return Inertia::render('cart/Show', [
            'cart' => $cart
        ]);
    }

    public function updateQuantity(Request $request, $id)
    {
        $quantity = $request->input('quantity');

        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $user = Auth::user();

        // Aseguramos que el ítem pertenezca al carrito activo del usuario
        $cart = $user->cart()->where('status', 'active')->first();

        if (!$cart) {
            return response()->json(['error' => 'No tienes un carrito activo.'], 404);
        }

        $cartItem = $cart->items()->where('id', $id)->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Producto no encontrado en tu carrito.'], 404);
        }

        $cartItem->update(['quantity' => $quantity]);

        return response()->json(['message' => 'Cantidad actualizada en la base de datos.']);
    }

    public function add(Product $product, Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $user = Auth::user();

        $cart = $user->cart()->firstOrCreate(['status' => 'active']);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->input('quantity', 1)
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->input('quantity', 1),
                'price' => $product->price
            ]);
        }

        return response()->json(['message' => 'Producto añadido correctamente.']);
    }

    public function remove($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);
        $cartItem->delete();

        return redirect()->route('cart.show')->with('success', 'Producto eliminado del carrito.');
    }
}
