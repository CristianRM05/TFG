<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Coupon;

class CouponController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount' => 'required|integer|min:1|max:100',
            'expires_at' => 'nullable|date',
        ]);

        $coupon = Coupon::create([
            'code' => strtoupper($validated['code']),
            'discount' => $validated['discount'],
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Cupón creado correctamente.',
            'coupon' => $coupon
        ], 201);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json(['message' => 'Cupón inválido.'], 404);
        }

        if ($coupon->expires_at && now()->gt($coupon->expires_at)) {
            return response()->json(['message' => 'Cupón caducado.'], 400);
        }

        if ($coupon->users()->where('user_id', Auth::id())->where('status', 'confirmed')->exists()) {
            return response()->json(['message' => 'Ya has usado este cupón.'], 400);
        }

        $existingRecord = $coupon->users()->where('user_id', Auth::id())->first();
        if (!$existingRecord) {
            $coupon->users()->attach(Auth::id(), ['status' => 'pending']);
        }

        return response()->json([
            'message' => 'Cupón aplicado correctamente.',
            'discount' => $coupon->discount
        ]);
    }
    public function createPersonalizedCoupon(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'discount' => 'required|integer|min:1|max:100',
            'expires_at' => 'nullable|date',
        ]);

        $code = strtoupper(Str::random(8));
        $coupon = Coupon::create([
            'code' => $code,
            'discount' => $validated['discount'],
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        $user = User::find($validated['user_id']);
        $user->coupons()->attach($coupon->id, [
            'status' => 'pending',
            'used_at' => null,
        ]);

        return response()->json([
            'message' => 'Cupón personalizado creado y asignado correctamente.',
            'coupon' => $coupon,
        ], 201);
    }

    public function getAvailableCoupons()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $coupons = Coupon::where(function ($query) {
            $query->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        })
            // Filtro: excluir los cupones que el usuario ya ha usado
            ->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('status', 'confirmed');
            })
            ->get()
            ->map(function ($coupon) {
                return [
                    'id' => $coupon->id,
                    'code' => $coupon->code,
                    'discount' => $coupon->discount,
                    'expires_at' => $coupon->expires_at,
                ];
            });

        return response()->json($coupons);
    }




    public function assignToUser(Request $request)
    {
        $validated = $request->validate([
            'coupon_id' => 'required|exists:coupons,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($validated['user_id']);
        $coupon = Coupon::find($validated['coupon_id']);

        if ($user->coupons()->where('coupon_id', $coupon->id)->exists()) {
            return response()->json(['message' => 'Este usuario ya tiene asignado este cupón.'], 400);
        }

        $user->coupons()->attach($coupon->id, ['used_at' => now()]);

        return response()->json(['message' => 'Cupón asignado correctamente.']);
    }
}
