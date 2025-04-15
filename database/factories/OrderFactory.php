<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Truck;
use App\Models\User;
use App\Models\Route;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_date' => now(),
            'customer_id' => 1, // Asegurate de tener al menos un cliente con ID 1
            'status' => OrderStatus::Pendiente, // Cambia esto según el enum que estés usando
            'scheduled_delivery_date' => now()->addDays(3),
            'truck_id' => null, // Se asigna desde el backoffice
            'delivery_person_id' => null, // También desde el backoffice
            'route_id' => null, // Idem
        ];
    }
}
