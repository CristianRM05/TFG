<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Enums\categoryProducts;

class ProductSeeder extends Seeder
{

    public function run()
    {
        for ($i=0; $i < 10; $i++) {
            Product::factory()->create([
                'name' => 'Bebida ' . $i,
                'num_reference' => 'BEB-00'.$i,
                'price' => rand(100, 500),
                'categoria' => "vino",
                'stock' => rand(10, 100),
                'description' => "Descripción de la bebida " . $i,
            ]);
        }
    }

}
