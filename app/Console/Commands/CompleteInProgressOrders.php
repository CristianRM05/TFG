<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
class CompleteInProgressOrders extends Command
{
    protected $signature = 'orders:auto-complete';
    protected $description = 'Completa pedidos después de 2 minutos en progreso';

    public function handle(): int
    {
        $orders = Order::where('status', 'In progress')
        ->where('assigned_at', '<=', Carbon::now()->subHours(24))
        ->get();

        foreach ($orders as $order) {
            $order->update(['status' => 'Completed']);
        }

        return self::SUCCESS;
    }

}
