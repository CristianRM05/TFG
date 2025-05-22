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
        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->with('product:id,name')
            ->take(5)
            ->get();

        $bottomProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderBy('total_qty')
            ->with('product:id,name')
            ->take(5)
            ->get();

        $monthlyRevenue = Order::select(
                DB::raw("DATE_FORMAT(created_at, '%b %Y') as month"),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('month')
            ->orderByRaw("STR_TO_DATE(month, '%b %Y')")
            ->get();

        $thisMonthRevenue = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        return Inertia::render('Analytics/Movimientos', [
            'topProducts'      => $topProducts->toArray(),
            'bottomProducts'   => $bottomProducts->toArray(),
            'monthlyRevenue'   => $monthlyRevenue->toArray(),
            'thisMonthRevenue' => $thisMonthRevenue,
            'auth'             => ['user' => auth()->user()],
        ]);
    }
}
