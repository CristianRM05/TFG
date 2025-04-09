<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Route as DeliveryRoute;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index()
    {
        $routes = DeliveryRoute::with(['truck', 'driver', 'orders'])->get();
        return view('backoffice.routes.index', compact('routes'));
    }

    public function store(Request $request)
    {
        // Lógica para crear rutas manuales o por lote si fuera necesario
    }
}
