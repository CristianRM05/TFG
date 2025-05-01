<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Enums\categoryProducts;
use Illuminate\Support\Facades\DB;


class ProductSeeder extends Seeder
{

    public function run(): void
    {
        $shelfId = DB::table('shelves')->inRandomOrder()->first()->id ?? null;

        $products = [
            [
                'name' => 'Coca-Cola 1L',
                'description' => 'Refresco clásico Coca-Cola en botella de 1 litro.',
                'num_reference' => 'REF-1001',
                'stock' => 50,
                'price' => 1.20,
                'discount_percent' => 10,
                'image_url' => 'https://via.placeholder.com/640x480.png?text=Coca-Cola+1L',
                'categoria' => categoryProducts::refresco->value,
                'shelf_id' => $shelfId,
            ],
            [
                'name' => 'Whisky Jack Daniel’s 700ml',
                'description' => 'Whisky estadounidense suave con aroma a roble y vainilla.',
                'num_reference' => 'REF-1002',
                'stock' => 20,
                'price' => 18.90,
                'discount_percent' => 0,
                'image_url' => 'https://via.placeholder.com/640x480.png?text=Jack+Daniel’s',
                'categoria' => categoryProducts::whisky->value,
                'shelf_id' => $shelfId,
            ],
            [
                'name' => 'Ron Barceló Añejo 700ml',
                'description' => 'Ron dominicano envejecido en barricas de roble.',
                'num_reference' => 'REF-1003',
                'stock' => 35,
                'price' => 12.50,
                'discount_percent' => 5,
                'image_url' => 'https://via.placeholder.com/640x480.png?text=Ron+Barceló',
                'categoria' => categoryProducts::ron->value,
                'shelf_id' => $shelfId,
            ],
            [
                'name' => 'Vodka Absolut 1L',
                'description' => 'Vodka sueco puro y suave ideal para cócteles.',
                'num_reference' => 'REF-1004',
                'stock' => 40,
                'price' => 15.00,
                'discount_percent' => 0,
                'image_url' => 'https://via.placeholder.com/640x480.png?text=Absolut+Vodka',
                'categoria' => categoryProducts::vodka->value,
                'shelf_id' => $shelfId,
            ],
            [
                'name' => 'Cerveza Heineken 330ml Pack x6',
                'description' => 'Pack de 6 cervezas Heineken, botella de 330ml.',
                'num_reference' => 'REF-1005',
                'stock' => 60,
                'price' => 5.99,
                'discount_percent' => 15,
                'image_url' => 'https://via.placeholder.com/640x480.png?text=Heineken+Pack+6',
                'categoria' => categoryProducts::cerveza->value,
                'shelf_id' => $shelfId,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
