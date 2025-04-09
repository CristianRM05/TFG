<?php
namespace App\Http\Controllers\BackOffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Route as DeliveryRoute;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index()
    {
        return Inertia::render('ManagerPage/Routes', [
            'routes' => $routes,
        ]);
    }

    public function store(Request $request)
    {
        // Lógica para crear rutas manuales o por lote si fuera necesario
    }
}
