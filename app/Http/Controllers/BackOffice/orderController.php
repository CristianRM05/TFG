<?php
namespace App\Http\Controllers\BackOffice;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Truck;
use App\Models\User;
use App\Models\Route as DeliveryRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', 'Pendiente')->get();
        return Inertia::render('ManagerPage/backOffice', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $trucks = Truck::all();
        $drivers = User::where('role', 'Dealer')->get();

        return response()->json([
            'order' => $order,
            'trucks' => $trucks,
            'drivers' => $drivers,
        ]);
    }

    public function assign(Request $request, Order $order)
    {
        $request->validate([
            'scheduled_date' => 'required|date',
            'truck_id' => 'required|exists:trucks,id',
            'driver_id' => 'required|exists:users,id',
            'departure_time' => 'required|date_format:H:i'
        ]);

        $route = DeliveryRoute::create([
            'truck_id' => $request->truck_id,
            'driver_id' => $request->driver_id,
            'departure_time' => $request->departure_time,
        ]);

        $order->update([
            'status' => 'Asignado',
            'scheduled_date' => $request->scheduled_date,
            'route_id' => $route->id,
        ]);

        return response()->json(['message' => 'Pedido asignado correctamente.']);
    }
}
