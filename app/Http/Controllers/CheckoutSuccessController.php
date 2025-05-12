<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

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

        $total = $cart->items->sum(fn($item) => $item->final_price * $item->quantity);

        // Crear el pedido usando el OrderController
        $orderController = new OrderController();
        $orderController->createOrder($user, $session, $cart, $total);

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
