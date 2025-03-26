<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(5);
        return response()->json($products, 200);    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            abort(404, 'Producto no encontrado');
        }

        return inertia('Products/Show', ['product' => $product]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'required|string|max:50|unique:products,num_reference',
            'weight' => 'required|numeric|min:0',
            'volume' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);



        Product::create($validated);

        return redirect()->back()->with('success', 'Producto creado con éxito');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'sometimes|string|max:50|unique:products,num_reference,' . $product->id,
            'weight' => 'sometimes|numeric|min:0',
            'volume' => 'sometimes|numeric|min:0',
            'price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photograph')) {
            if ($product->photograph) {
                Storage::disk('public')->delete($product->photograph);
            }

            $validated['photograph'] = $request->file('photograph')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->back()->with('success', 'Producto actualizado con éxito');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->photograph) {
            Storage::disk('public')->delete($product->photograph);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Producto eliminado correctamente');
    }
}
