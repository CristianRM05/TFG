<?php

namespace App\Http\Controllers;

use App\Enums\RolesEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Shelf;
use App\Models\Product;

class AdminDashboardController extends Controller
{
    public function create()
{
    $shelves = Shelf::with(['products'])
                ->get()
                ->map(function ($shelf) {
                    return [
                        'id' => $shelf->id,
                        'code' => $shelf->code,
                        'location' => $shelf->location,
                        'max_capacity' => $shelf->max_capacity,
                        'total_stock' => $shelf->products->sum('stock'),
                        'products_count' => $shelf->products->count(),
                        'capacity_percentage' => $shelf->max_capacity > 0
                            ? min(100, ($shelf->products->sum('stock') / $shelf->max_capacity) * 100)
                            : 0,
                            'created_at' => $shelf->created_at,
                    ];
                });

    return Inertia::render('dashboardAdmin', [  
        'shelves' => $shelves,
        'roles' => RolesEmployee::casesArray(),
        'products' => Product::with('shelf')->get(),
        'auth' => ['user' => auth()->user()]
    ]);
}

public function banUser(User $user, Request $request)
{
    $request->validate([
        'banned' => 'required|boolean'
    ]);

    $request->banned ? $user->ban() : $user->unban();

    // Devuelve una respuesta Inertia en lugar de JSON puro
    return back()->with([
        'success' => true,
        'message' => $request->banned
            ? 'Usuario baneado correctamente'
            : 'Usuario desbaneado correctamente',
        'user' => $user->fresh()
    ]);


}

 /**
     * Elimina una estantería (shelf)
     */
    public function deleteShelf(Shelf $shelf, Request $request)
    {
        try {
            $shelf->delete();

            return back()->with([
                'success' => true,
                'message' => 'Estantería eliminada correctamente',
                // Incluye los datos actualizados si es necesario
                'shelves' => Shelf::all()
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'success' => false,
                'message' => 'Error al eliminar la estantería: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Elimina un producto
     */

     public function deleteProduct(Product $product, Request $request)
     {
         $product->delete();
         return redirect()->back()->with('success', true);
     }

public function storeShelf(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:shelves',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|numeric|min:1',
        ]);

        $shelf = Shelf::create($validated);

        return back()->with([
            'success' => true,
            'message' => 'Estantería creada con éxito',
            'shelf' => $shelf
        ]);

}

}
