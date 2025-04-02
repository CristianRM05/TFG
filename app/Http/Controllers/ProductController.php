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
            'stock' => 'required|numeric|min:0',
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
        'unassignedProducts' => Product::whereNull('shelf_id')
            ->select(['id', 'name', 'num_reference', 'image_url', 'stock'])
            ->get(),
            
        'shelves' => Shelf::with(['products' => function($query) {
                $query->select('id', 'shelf_id', 'stock');
            }])
            ->orderBy('location')
            ->get()
            ->map(function ($shelf) {
                // Asegúrate de incluir total_stock en los datos
                $shelf->total_stock = $shelf->products->sum('stock');
                return $shelf->only(['id', 'code', 'location', 'max_capacity', 'total_stock']);
            }),
            
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
            $query->with('shelf:id,location')
                  ->select('id', 'name', 'num_reference', 'image_url', 'shelf_id', 'stock'); // Solo añadir stock aquí
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

public function stockIndex()
{
    // 1. Obtenemos productos con stocks y relaciones (manteniendo tu estructura original)
    $products = Product::with(['stocks' => function($query) {
        $query->where('available_quantity', '>', 0)
              ->with(['product.shelf']); // Relación original
    }, 'shelf']) 
    ->whereHas('stocks', function($query) {
        $query->where('available_quantity', '>', 0);
    })
    ->get()
    ->each(function ($product) {
        // 2. Mantenemos tu lógica original de relación shelf
        $product->stocks->each(function ($stock) use ($product) {
            if (!$stock->relationLoaded('shelf') && $product->relationLoaded('shelf')) {
                $stock->setRelation('shelf', $product->shelf);
            }
        });

        // 3. Cálculos por producto (existente)
        $product->occupied_capacity = $product->stocks->sum('available_quantity');
        
        if ($product->shelf && $product->shelf->max_capacity > 0) {
            $product->capacity_percentage = round(
                ($product->occupied_capacity / $product->shelf->max_capacity) * 100, 
                2
            );
        }

        // 4. Mantenemos datos originales para compatibilidad
        $product->original_stocks = $product->stocks->map(function ($stock) {
            return [
                'id' => $stock->id,
                'quantity' => $stock->available_quantity,
                'shelf_data' => $stock->shelf ? [
                    'id' => $stock->shelf->id,
                    'location' => $stock->shelf->location
                ] : null
            ];
        });
    });

    // 5. Preparamos datos para vistas (sin perder funcionalidad)
    $shelvesData = $products->groupBy('shelf.id')->map(function ($products, $shelfId) {
        $firstProduct = $products->first();
        $shelf = $firstProduct->shelf;
        
        return [
            'id' => $shelf->id,
            'location' => $shelf->location,
            'max_capacity' => $shelf->max_capacity,
            'total_occupied' => $products->sum('occupied_capacity'),
            'occupation_percentage' => $shelf->max_capacity > 0 
                ? round(($products->sum('occupied_capacity') / $shelf->max_capacity) * 100, 2)
                : 0,
            'products_count' => $products->count(),
            'original_shelf' => $shelf, // Mantenemos objeto original
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'occupied_capacity' => $product->occupied_capacity,
                    'percentage' => $product->capacity_percentage,
                    'stocks' => $product->original_stocks // Datos originales
                ];
            })
        ];
    })->values();

    // 6. Debug completo (verifica ambos formatos)
    \Log::debug('Datos StockIndex', [
        'products_sample' => $products->first() ? [
            'id' => $products->first()->id,
            'stocks_count' => $products->first()->stocks->count(),
            'shelf_data' => $products->first()->shelf,
            'calculations' => [
                'occupied' => $products->first()->occupied_capacity,
                'percentage' => $products->first()->capacity_percentage
            ]
        ] : null,
        'shelves_sample' => $shelvesData->first()
    ]);

    return Inertia::render('stock/index', [
        'products' => $products, // Formato original
        'shelves' => $shelvesData, // Nuevo formato agrupado
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
