<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Shelf;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Enums\categoryProducts;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
public function index(Request $request)
{
    $query = Product::query()
        ->where('is_visible', true)
        ->where('stock', '>', 0);

    if ($request->has('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }

    if ($request->filled('category') && $request->category !== 'todas') {
        $query->where('categoria', $request->category);
    }

    if ($request->filled('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }

    if ($request->filled('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    return response()->json($query->paginate(6));
}


    public function show(Product $product)
{
    $product->load('shelf');

    return Inertia::render('stock/showProduct', [
        'product' => $product
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'required|string|max:50|unique:products,num_reference',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'volume' => 'nullable|numeric|min:0',
            'categoria' => 'required|string',
            'stock' => 'nullable|numeric|min:0',
        ]);

        $product = Product::create($validated);

        $product->stock()->create([
            'available_quantity' => $request->stock ?? 0,
            'location' => 'Almacén Principal',
        ]);

        return redirect()->back()->with('success', 'Producto creado con éxito');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'sometimes|string|max:50',
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

    public function unassignedProducts()
    {
        return inertia('shelves/shelvesIndex', [
            'unassignedProducts' => Product::whereNull('shelf_id')->with('shelf')->get(),
            'shelves' => Shelf::with(['products' => function ($query) {
                $query->select('id', 'shelf_id', 'stock');
            }])->orderBy('location')->get(),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function shelvesManagement()
    {
        return inertia('shelves/shelvesIndex', [
            'unassignedProducts' => Product::whereNull('shelf_id')
                ->select(['id', 'name', 'num_reference', 'image_url', 'stock'])
                ->get(),
            'shelves' => Shelf::with(['products' => function ($query) {
                $query->select('id', 'shelf_id', 'stock');
            }])
                ->orderBy('location')
                ->get()
                ->map(function ($shelf) {
                    $shelf->total_stock = $shelf->products->sum('stock');
                    return $shelf->only(['id', 'code', 'location', 'max_capacity', 'total_stock']);
                }),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    public function assignShelf(Request $request, $productId)
    {
        $request->validate(['shelf_id' => 'required|exists:shelves,id']);

        $product = Product::findOrFail($productId);
        $shelf = Shelf::findOrFail($request->shelf_id);

        $currentStockInShelf = Product::where('shelf_id', $shelf->id)->sum('stock');

        if (($currentStockInShelf + $product->stock) > $shelf->max_capacity) {
            return back()->withErrors([
                'shelf_id' => 'La estantería no tiene suficiente capacidad. ' .
                    'Capacidad máxima: ' . $shelf->max_capacity .
                    ', Stock actual: ' . $currentStockInShelf .
                    ', Stock a añadir: ' . $product->stock
            ]);
        }

        $product->shelf_id = $request->shelf_id;
        $product->save();

        return back()->with('success', 'Producto asignado correctamente a la estantería');
    }

    public function showShelf(Shelf $shelf)
    {
        return inertia('shelves/show', [
            'shelf' => $shelf->load(['products' => function ($query) {
                $query->with('shelf:id,location')
                    ->select('id', 'name', 'num_reference', 'image_url', 'shelf_id', 'stock');
            }])
        ]);
    }

    /**
     * Muestra solo productos visibles y con stock > 0
     */
    public function stockIndex()
    {
        $products = Product::with('shelf')
            ->where('is_visible', true)
            ->where('stock', '>', 0)
            ->select(['id', 'name', 'num_reference', 'price', 'image_url', 'stock', 'shelf_id'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'num_reference' => $product->num_reference,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'stocks' => [[
                        'available_quantity' => $product->stock,
                        'location' => $product->shelf?->location ?? 'Sin ubicación',
                        'shelf' => $product->shelf ? [
                            'max_capacity' => $product->shelf->max_capacity
                        ] : null
                    ]]
                ];
            });

        return Inertia::render('stock/stockIndex', [
            'products' => $products,
            'auth' => [
                'user' => Auth::user() ? ['name' => Auth::user()->name, 'email' => Auth::user()->email] : null,
            ],
        ]);
    }

    //para mostrar todos los productos a manager
 public function stockIndexManager()
    {
        $products = Product::with('shelf')
            ->select(['id', 'name', 'num_reference', 'price', 'image_url', 'stock', 'shelf_id', 'is_visible'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'num_reference' => $product->num_reference,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'is_visible' => $product->is_visible,
                    'stocks' => [[
                        'available_quantity' => $product->stock,
                        'location' => $product->shelf?->location ?? 'Sin ubicación',
                        'shelf' => $product->shelf ? [
                            'max_capacity' => $product->shelf->max_capacity
                        ] : null
                    ]]
                ];
            });

        return Inertia::render('ManagerPages/stockIndexManager', [
            'products' => $products,
            'auth' => [
                'user' => Auth::user() ? Auth::user()->only(['name', 'email']) : null,
            ],
        ]);
    }

    public function updateShelf(Product $product, Request $request)
    {
        $product->update([
            'shelf_id' => $request->shelf_id
        ]);

        return back()->with('success', 'Producto desasignado correctamente');
    }

    public function assignSplitToShelf(Request $request, Product $product)
    {
        $request->validate([
            'shelf_id' => 'required|exists:shelves,id',
            'quantity' => 'required|integer|min:1|max:' . $product->stock
        ]);

        DB::transaction(function () use ($product, $request) {
            $shelfId = $request->shelf_id;
            $quantity = $request->quantity;

            $existingProduct = Product::where('num_reference', $product->num_reference)
                ->where('shelf_id', $shelfId)
                ->where('id', '!=', $product->id)
                ->first();

            if ($existingProduct) {
                $existingProduct->stock += $quantity;
                $existingProduct->save();

                $product->stock -= $quantity;

                if ($product->stock <= 0) {
                    $product->delete();
                } else {
                    $product->save();
                }
            } else {
                $shelf = Shelf::findOrFail($shelfId);
                $usedSpace = $shelf->products()->sum('stock');
                $availableSpace = $shelf->max_capacity - $usedSpace;

                $assignQuantity = min($quantity, $availableSpace);

                $product->shelf_id = $shelfId;
                $product->stock = $assignQuantity;
                $product->save();

                if ($quantity > $assignQuantity) {
                    $remainingQuantity = $quantity - $assignQuantity;

                    $newProduct = $product->replicate(['final_price']);
                    $newProduct->stock = $remainingQuantity;
                    $newProduct->shelf_id = null;
                    $newProduct->save();
                }
            }
        });

        return back()->with('success', 'Producto asignado correctamente');
    }

    public function removeAndMergeFromShelf(Product $product)
    {
        DB::transaction(function () use ($product) {
            $currentShelfId = $product->shelf_id;

            $siblingProducts = Product::where('num_reference', $product->num_reference)
                ->where('shelf_id', $currentShelfId)
                ->where('id', '!=', $product->id)
                ->get();

            if ($siblingProducts->isNotEmpty()) {
                $originalProduct = $siblingProducts->first();
                $originalProduct->stock += $product->stock;
                $originalProduct->save();
                $product->delete();
            } else {
                $unassignedSibling = Product::where('num_reference', $product->num_reference)
                    ->whereNull('shelf_id')
                    ->where('id', '!=', $product->id)
                    ->first();

                if ($unassignedSibling) {
                    $unassignedSibling->stock += $product->stock;
                    $unassignedSibling->save();
                    $product->delete();
                } else {
                    $product->shelf_id = null;
                    $product->save();
                }
            }
        });

        return back()->with('success', 'Operación completada');
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

    public function getCategorias()
    {
        $categorias = collect(categoryProducts::cases())->map(function ($case) {
            return [
                'value' => $case->value,
                'name' => ucfirst($case->name),
            ];
        });

        return response()->json($categorias);
    }

public function toggleVisibility(Product $product)
{
    if (! auth()->check()) {
        abort(403, 'Usuario no autenticado');
    }

    if (! in_array(auth()->user()->role?->name, ['Manager', 'Admin'])) {
        abort(403, 'No tienes permisos');
    }

    $product->is_visible = ! $product->is_visible;
    $product->save();

    return back();
}



}
