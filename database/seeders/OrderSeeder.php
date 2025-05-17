<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Asegúrate de tener usuarios para asociar
        $users = User::all();

        if ($users->count() === 0) {
            $this->command->warn('No hay usuarios en la base de datos. Creando uno de prueba...');
            $user = User::factory()->create();
            $users = collect([$user]);
        }

        foreach (range(1, 20) as $i) {
            $user = $users->random();

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => fake()->randomFloat(2, 20, 500),
                'status' => 'shipped', // puedes usar también 'pending', etc.
                'payment_method' => fake()->randomElement(['card', 'paypal', 'bank']),
                'shipping_address' => fake()->address(),
                'stripe_session_id' => fake()->uuid(),
                'assigned_at' => now()->subDays(rand(0, 30)),
            ]);

            // Agregar items a la orden
            foreach (range(1, rand(1, 5)) as $j) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => rand(1, 10), // asegúrate de tener productos
                    'quantity' => rand(1, 3),
                    'price' => fake()->randomFloat(2, 10, 100),
                ]);
            }
        }
    }
}
