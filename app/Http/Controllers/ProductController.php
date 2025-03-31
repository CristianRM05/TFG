<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Shelf; 
use Inertia\Inertia;
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
//shelves
public function unassignedProducts()
{
    $unassignedProducts = Product::whereNull('shelf_id')->with('shelf')->get();
    $shelves = Shelf::all();
    
    return inertia('shelves/index', [
        'unassignedProducts' => $unassignedProducts,
        'shelves' => $shelves
    ]);
}
    public function shelvesManagement()
    {
        return inertia('shelves/Index', [
            'unassignedProducts' => Product::query()
                ->whereNull('shelf_id')
                ->select(['id', 'name', 'num_reference', 'image_url'])
                ->get(),
                
            'shelves' => Shelf::query()
                ->orderBy('aisle')
                ->orderBy('level')
                ->select(['id', 'name', 'aisle', 'level', 'capacity'])
                ->get(),
                
            'flash' => session()->only(['success', 'error'])
        ]);
    }

// Método para asignar estantería
public function assignShelf(Request $request, Product $product)
{
    $request->validate([
        'shelf_id' => 'required|exists:shelves,id'
    ]);

    $product->update(['shelf_id' => $request->shelf_id]);

    return back()->with('success', 'Ubicación asignada correctamente');
}

public function showShelf(Shelf $shelf)
{
    return inertia('shelves/show', [
        'shelf' => $shelf->load(['products' => function($query) {
            $query->with('shelf:id,location') // Carga la relación shelf solo con location
                  ->select('id', 'name', 'num_reference', 'image_url', 'shelf_id');
        }])
    ]);
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

    public function stockIndex()
{
    $products = Product::with(['stocks' => function($query) {
            $query->where('available_quantity', '>', 0)
                ->with('shelf');
        }])
        ->whereHas('stocks', function($query) {
            $query->where('available_quantity', '>', 0);
        })
        ->get();

    return Inertia::render('stock/index', [
        'products' => $products,
        'auth' => [
            'user' => auth()->user() ? [
                'name' => auth()->user()->name,
                'email' => auth()->user()->email
            ] : null
        ]
    ]);
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
