<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class DeliveryNoteController extends Controller
{
public function index(Request $request)
{
    $query = Order::with('user')
        ->where('status', 'shipped')
        ->when($request->search, function ($q) use ($request) {
            $q->where('ref', 'like', "%{$request->search}%")
              ->orWhereHas('user', fn($q2) =>
                  $q2->where('name', 'like', "%{$request->search}%")
              );
        })
        ->orderBy('assigned_at', 'desc');

    return response()->json($query->paginate(10)); // <= esto está bien
}


    public function download(Order $order)
    {
        $pdf = Pdf::loadView('pdf.delivery-note', ['order' => $order]);
        return $pdf->download("albaran-{$order->ref}.pdf");
    }

    public function view()
    {
        return Inertia::render('ManagerPages/DeliveryNotesPage');
    }
}
