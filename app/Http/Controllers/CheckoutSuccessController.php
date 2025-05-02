<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Illuminate\Support\Facades\Http;

class CheckoutSuccessController extends Controller
{
    public function __invoke(Request $request)
    {
        $sessionId = $request->query('session_id');
        $user = Auth::user();

        if (!$sessionId) {
            return redirect()->route('dashboard');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = StripeSession::retrieve($sessionId);
        } catch (\Exception $e) {
            return redirect()->route('dashboard');
        }
        if (Order::where('stripe_session_id', $session->id)->exists()) {
            return redirect()->route('dashboard', ['success' => 'true']);
        }

        $cart = $user->cart()->where('status', 'active')->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('dashboard');
        }

        $total = $cart->items->sum(fn($item) => $item->price * $item->quantity);

        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $total,
            'status' => 'paid',
            'payment_method' => $session->payment_method_types[0] ?? 'card',
            'shipping_address' => $user->location,
            'stripe_session_id' => $session->id
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price
            ]);
        }

        // Confirmar el uso del cupón
        $pendingCoupons = $user->coupons()->wherePivot('status', 'pending')->get();
        foreach ($pendingCoupons as $coupon) {
            $coupon->users()->updateExistingPivot($user->id, [
                'status' => 'confirmed',
                'used_at' => now()
            ]);
        }

        // Limpiar carrito
        $cart->items()->delete();
        $cart->update(['status' => 'completed']);


        return redirect()->route('dashboard', ['success' => 'true']);
    }
}
