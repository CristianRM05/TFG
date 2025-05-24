<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $months = [
            '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'
        ];

        $products = Product::all();
        $userId = 1; // puedes personalizar o randomizar esto si tienes más usuarios

        foreach ($months as $month) {
            foreach ($products as $product) {
                $quantity = rand(5, 40);
                $price = round(mt_rand(2800, 7500) / 100, 2); // entre 28 y 75 €
                $total = $quantity * $price;

                $order = Order::create([
                    'user_id' => $userId,
                    'total_amount' => $total,
                    'status' => 'completed',
                    'payment_method' => 'stripe',
                    'shipping_address' => 'Calle Ficticia 123, Madrid',
                    'stripe_session_id' => null,
                    'assigned_at' => null,
                    'created_at' => Carbon::parse($month . '-15'), // día fijo en el centro del mes
                    'updated_at' => Carbon::parse($month . '-15'),
                ]);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);
            }
        }
    }
}
