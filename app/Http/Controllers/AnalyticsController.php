<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Display the analytics dashboard for manager.
     */
    public function index()
    {
        // 1) Top 5 productos más vendidos (por unidades)
        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->with('product:id,name')
            ->take(5)
            ->get();

        // 2) Top 5 productos menos vendidos
        $bottomProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderBy('total_qty')
            ->with('product:id,name')
            ->take(5)
            ->get();

        // 3) Ingresos mensuales últimos 6 meses
        $monthlyRevenue = Order::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 4) Balance de este mes (último registro de monthlyRevenue)
        $thisMonthRevenue = (float) ($monthlyRevenue->last()->revenue ?? 0);

        return Inertia::render('Analytics/Movimientos', [
            'topProducts'      => $topProducts,
            'bottomProducts'   => $bottomProducts,
            'monthlyRevenue'   => $monthlyRevenue,
            'thisMonthRevenue' => $thisMonthRevenue,
            // Inyectamos el usuario autenticado para que la vista pueda leer auth.user
            'auth'             => [
                'user' => auth()->user()
            ],
        ]);
    }
}
