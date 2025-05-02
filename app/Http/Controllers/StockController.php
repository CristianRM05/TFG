<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    public function index()
    {
        $products = Product::with(['stocks' => function($query) {
                $query->where('available_quantity', '>', 0)
                    ->with('shelf');
            }])
            ->whereHas('stocks', function($query) {
                $query->where('available_quantity', '>', 0);
            })
            ->get();

        // Debug: Verifica los datos antes de enviar
        logger()->info('Products data:', ['count' => $products->count()]);

        return Inertia::render('stock/stockIndex', [
            'products' => $products,
            'auth' => [
                'user' => Auth::user() ? [
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email
                ] : null
            ]
        ]);
    }
}