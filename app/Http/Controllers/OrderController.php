<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderAssignedMail;
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

    //mostrar todos los pedidos con sus items
    public function managerOrders()
    {
        $orders = Order::with('items.product')->get();

        return Inertia::render('ManagerPages/ManagerOrders', [
            'orders' => $orders
        ]);
    }

    public function createOrder($user, $session, $cart, $total)
    {
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $total,
            'status' => 'paid',
            'payment_method' => $session->payment_method_types[0] ?? 'card',
            'shipping_address' => $user->location,
            'stripe_session_id' => $session->id,
            'ref' => $this->generateUniqueRef()
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price
            ]);
        }

        return $order;
    }

    private function generateUniqueRef()
    {
        do {
            $ref = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        } while (Order::where('ref', $ref)->exists());

        return $ref;
    }

    public function assignOrder($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'paid') {
            return response()->json(['error' => 'Solo se pueden asignar pedidos pagados.'], 400);
        }

        $order->update([
            'status' => 'In progress',
            'assigned_at' => now(),
        ]);

        // Enviar el correo
        Mail::to($order->user->email)->send(new OrderAssignedMail($order));

        return response()->json(['message' => 'Pedido asignado correctamente.']);
    }



}
