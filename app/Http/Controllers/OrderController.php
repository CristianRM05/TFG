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
use App\Mail\NewOrderMail;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class OrderController extends Controller
{
    use AuthorizesRequests;


    public function checkout(Request $request)
    {
        $user = Auth::user();

        if (!$user->location) {
            return response()->json([
                'error' => 'Debes completar tu dirección antes de realizar el pedido.'
            ], 422);
        }

        $cart = $user->cart()->where('status', 'active')->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'error' => 'El carrito está vacío.'
            ], 400);
        }

        // 🔒 Comprobar stock antes de crear la sesión de Stripe
        foreach ($cart->items as $item) {
            $product = $item->product;
            if ($product->stock < $item->quantity) {
                return response()->json([
                    'error' => "No hay suficiente stock para '{$product->name}'. Quedan {$product->stock} unidades."
                ], 400);
            }
        }

        // Si todo OK, seguimos con Stripe
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
            'cancel_url' => route('checkout.cancel'),
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

    //para poder descargar el albaran desde manager
    public function downloadInvoiceManager($id)
    {
        $order = Order::with('items.product')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'));

        return $pdf->download("albaran_pedido_{$order->ref}.pdf");
    }



    public function createOrder($user, $session, $cart, $total)
    {
        return DB::transaction(function () use ($user, $session, $cart, $total) {

            // Verificar stock antes de crear el pedido
            foreach ($cart->items as $item) {
                $product = $item->product()->lockForUpdate()->first(); // bloquea la fila

                if ($product->stock < $item->quantity) {
                    throw new \Exception("No hay suficiente stock para el producto: {$product->name}");
                }
            }

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
                $product = $item->product()->lockForUpdate()->first();

                if ($product->stock < $item->quantity) {
                    throw new \Exception("Stock insuficiente para el producto: {$product->name}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ]);

                $product->stock -= $item->quantity;
                $product->save();
                Mail::to($user->email)->send(new NewOrderMail($order));
            }

            return $order;
        });
    }


    private function generateUniqueRef()
    {
        do {
            $ref = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        } while (Order::where('ref', $ref)->exists());

        return $ref;
    }
    public function downloadInvoice(Order $order)
    {
        // Validación manual: solo el dueño puede ver su factura
        if ($order->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para ver esta factura.');
        }

        $order->load('items.product');

        $pdf = Pdf::loadView('invoices.invoice', [
            'order' => $order,
            'user' => $order->user,
            'date' => now()->format('d/m/Y'),
        ]);

        return $pdf->download("Factura_{$order->ref}.pdf");
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
