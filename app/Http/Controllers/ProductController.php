<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Shelf;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Enums\categoryProducts;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(5);
        return response()->json($products, 200);
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
        // Validación (sin el campo stock)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'required|string|max:50|unique:products,num_reference',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'volume' => 'nullable|numeric|min:0',
            'categoria' => 'required|nullable|string',
            'stock' => 'nullable|numeric|min:0',
        ]);

        // Crear el producto
        $product = Product::create($validated);

        // Crear el registro de stock asociado
        $product->stock()->create([
            'available_quantity' => $request->stock ?? 0, // Valor por defecto
            'location' => 'Almacén Principal'
        ]);

        return redirect()->back()->with('success', 'Producto creado con éxito');
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'num_reference' => 'sometimes|string|max:50|' . $product->id,
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
            'unassignedProducts' => Product::whereNull('shelf_id')
                ->with('shelf')
                ->get(),

            'shelves' => Shelf::with(['products' => function ($query) {
                $query->select('id', 'shelf_id', 'stock');
            }])
                ->orderBy('location')
                ->get(),

            'flash' => session()->only(['success', 'error'])
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

            'flash' => session()->only(['success', 'error'])
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

    public function stockIndex()
    {
        $products = Product::with(['shelf'])
            ->select(['id', 'name', 'num_reference', 'price', 'image_url', 'stock', 'shelf_id'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'num_reference' => $product->num_reference,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                    'stocks' => [ // Mantenemos la estructura de array que espera el frontend
                        [
                            'available_quantity' => $product->stock, // Usamos el campo directo
                            'location' => $product->shelf?->location ?? 'Sin ubicación',
                            'shelf' => $product->shelf ? [
                                'max_capacity' => $product->shelf->max_capacity
                            ] : null
                        ]
                    ]
                ];
            });

        return Inertia::render('stock/stockIndex', [
            'products' => $products
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
}
