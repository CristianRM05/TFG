<?php

namespace App\Http\Controllers;

use App\Models\Truck;
use App\Enums\StatusTruck;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TruckController extends Controller
{
    public function index()
    {
        return Inertia::render('ManagerPages/TruckManagement', [
            'trucks' => Truck::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string|unique:trucks,license_plate',
            'max_capacity' => 'required|numeric|min:0',
        ]);

        Truck::create([
            'license_plate' => $request->license_plate,
            'max_capacity' => $request->max_capacity,
            'status' => StatusTruck::Disponible,
        ]);

        return redirect()->route('trucks.index');
    }

    public function update(Request $request, Truck $truck)
    {
        $request->validate([
            'license_plate' => 'required|string|unique:trucks,license_plate,' . $truck->id,
            'max_capacity' => 'required|numeric|min:0',
        ]);

        $truck->update($request->only(['license_plate', 'max_capacity']));

        return redirect()->route('trucks.index');
    }

    public function destroy(Truck $truck)
    {
        $truck->delete();
        return redirect()->route('trucks.index');
    }

    public function updateStatus(Request $request, Truck $truck)
    {
        $request->validate([
            'status' => 'required|in:Disponible,Ocupado,Mantenimiento',
        ]);

        if ($truck->status !== 'Ocupado') {
            $truck->status = $request->status;
            $truck->save();
        }

        return redirect()->route('trucks.index');
    }
}
