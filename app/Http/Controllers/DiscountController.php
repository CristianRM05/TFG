<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Añade esta línea
class DiscountController extends Controller
{
    // app/Http/Controllers/DiscountController.php

    
public function index()
{
    return Inertia::render('discounts/indexDiscounts', [
        'products' => Product::where('discount_percent', '>', 0)->get()->toArray(),
        'productsWithoutDiscount' => Product::where('discount_percent', 0)
                                        ->orWhereNull('discount_percent')
                                        ->get()
                                        ->toArray()
    ]);
}


    public function apiProductsWithoutDiscount()
    {
        $products = Product::whereNull('discount_percent')
            ->orWhere('discount_percent', 0)
            ->get(['id', 'name', 'price']);
            
        return response()->json($products);
    }

    public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'discount_percent' => 'required|numeric|min:0|max:100'
    ]);

    $product = Product::find($request->product_id);
    $product->update([
        'discount_percent' => $request->discount_percent
    ]);

    return redirect()->route('discounts.index')
        ->with('success', 'Descuento aplicado correctamente');
}

    public function destroy(Product $product)
    {
        $product->update(['discount_percent' => null]);
    }
}