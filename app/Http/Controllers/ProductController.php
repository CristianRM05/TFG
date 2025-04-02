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
        // Validación (sin el campo stock)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'required|string|max:50|unique:products,num_reference',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'volume' => 'nullable|numeric|min:0',
            'categoria' => 'nullable|string',
            'stock' => 'nullable|numeric|min:0',
        ]);

        // Crear el producto
        $product = Product::create($validated);

        // Crear el registro de stock asociado
        $product->stock()->create([
            'available_quantity' => $request->stock, // El stock viene del formulario
            'location' => 'Almacén Principal' // Valor por defecto o podrías recibirlo del request
        ]);

        return redirect()->back()->with('success', 'Producto creado con éxito');
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'sometimes|string|max:50|unique:products,num_reference,' . $product->id,
            'stock' => 'sometimes|numeric|min:0',
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
