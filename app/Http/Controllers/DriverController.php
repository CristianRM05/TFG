<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Route; // Asume que tienes un modelo Route
use Symfony\Component\HttpFoundation\Response; // Importa la clase Response

class DriverController extends Controller
{
    // Método para renderizar la página de la lista de rutas
    public function showRoutes(Request $request)
    {
        return Inertia::render('Driver/Routes');
    }

    // Método para la llamada API desde axios para obtener las rutas asignadas
    public function getAssignedRoutesApi(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->role->is(\App\Enums\RolesEmployee::Dealer)) {
            return response()->json(['message' => 'No autorizado'], Response::HTTP_UNAUTHORIZED);
        }

        $status = $request->query('status', 'assigned'); // Obtener status del query param

        $routes = Route::where('driver_id', $user->id)
            ->where('status', $status)
            ->orderBy('estimated_delivery_date', 'asc')
            ->get();

        return response()->json($routes);
    }

    // Método para mostrar el detalle de UNA ruta (necesario para el Link)
    public function showRouteDetail(Request $request, Route $route) // Usa Route Model Binding
    {
        // Verificar que la ruta pertenece al conductor autenticado (¡Importante!)
        if ($route->driver_id !== Auth::id()) {
            abort(Response::HTTP_FORBIDDEN, 'No tienes permiso para ver esta ruta.');
        }

        // Cargar relaciones si es necesario (ej: paradas, pedidos)
        $route->load(['stops', 'orders']);

        return Inertia::render('Driver/RouteDetail', [ // Componente para el detalle
            'route' => $route
        ]);
    }

    // Ejemplo de método para actualizar el estado de una ruta (podría causar un 500 si algo falla)
    public function updateRouteStatus(Request $request, Route $route)
    {
        // Verificar que la ruta pertenece al conductor autenticado
        if ($route->driver_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado para modificar esta ruta'], Response::HTTP_FORBIDDEN);
        }

        $request->validate([
            'status' => 'required|string|in:assigned,in_transit,delivered,failed', // Ejemplo de estados
        ]);

        try {
            $route->status = $request->input('status');
            $route->save();
            return response()->json(['message' => 'Estado de la ruta actualizado correctamente']);
        } catch (\Exception $e) {
            // Log del error para depuración (¡Importante en producción!)
            \Log::error('Error al actualizar el estado de la ruta: ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar el estado de la ruta'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
