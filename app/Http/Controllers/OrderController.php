<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

use Inertia\Inertia;

class OrderController extends Controller
{


    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user->location) {
            return response()->json([
                'message' => 'Debes completar tu dirección antes de realizar el pedido.'
            ], 422);
        }

        $cart = $user->cart()->where('status', 'active')->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'El carrito está vacío.'
            ], 400);
        }

        $discount = $request->input('discount', 0);
        $discountFactor = (100 - $discount) / 100;

        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = [];

        foreach ($cart->items as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $item->product->name,
                    ],
                    'unit_amount' => intval($item->price * 100 * $discountFactor),
                ],
                'quantity' => $item->quantity,

            ];
        }

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('cart.show'),
        ]);

        return response()->json([
            'url' => $session->url,
        ]);
    }


    public function myOrders()
    {
        $user = auth()->user();

        $orders = $user->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->paginate(6);

        return Inertia::render('MyOrders', [
            'orders' => $orders
        ]);
    }


}
