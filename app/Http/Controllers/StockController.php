<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

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

     
        return Inertia::render('stock/stockIndex', [
            'products' => $products,
            'auth' => [
                'user' => auth()->user() ? [
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email
                ] : null
            ]
        ]);
    }
}