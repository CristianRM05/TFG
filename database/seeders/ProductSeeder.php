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
                'description' => '.',
                'num_reference' => 'REF-1001',
                'stock' => 50,
                'price' => 1.20,
                'discount_percent' => 10,
                'image_url' => 'https://i.ibb.co/MxsbRXhD/etiqueta-Azul.png',
                'categoria' => categoryProducts::refresco->value,
                'shelf_id' => $shelfId,
                'is_visible' => true,
            ],
            [
                'name' => 'Whisky Jack Daniel’s 700ml',
                'description' => 'Whisky estadounidense suave con aroma a roble y vainilla.',
                'num_reference' => 'REF-1002',
                'stock' => 20,
                'price' => 18.90,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/r2C9jVNr/etiqueta-Negra.png',
                'categoria' => categoryProducts::whisky->value,
                'shelf_id' => $shelfId,
                'is_visible' => true,
            ],
            [
                'name' => 'Ron Barceló Añejo 700ml',
                'description' => 'Ron dominicano envejecido en barricas de roble.',
                'num_reference' => 'REF-1003',
                'stock' => 35,
                'price' => 12.50,
                'discount_percent' => 5,
                'image_url' => 'https://i.ibb.co/b56q07dX/tequila2.png',
                'categoria' => categoryProducts::ron->value,
                'shelf_id' => $shelfId,
                'is_visible' => true,
            ],
            [
                'name' => 'Vodka Absolut 1L',
                'description' => 'Vodka sueco puro y suave ideal para cócteles.',
                'num_reference' => 'REF-1004',
                'stock' => 40,
                'price' => 15.00,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/tw4Lbppk/scotch-Whisky.png',
                'categoria' => categoryProducts::vodka->value,
                'shelf_id' => $shelfId,
                'is_visible' => true,
            ],
            [
                'name' => 'Vodka Absolut 1L',
                'description' => 'Vodka sueco puro y suave ideal para cócteles.',
                'num_reference' => 'REF-1004',
                'stock' => 40,
                'price' => 15.00,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/SwTh3vZY/malt-Whiskey.png',
                'categoria' => categoryProducts::vodka->value,
                'shelf_id' => $shelfId,
                'is_visible' => true,
            ],
            [
                'name' => 'Producto Oculto',
                'description' => 'Este producto no deberia aparecer.',
                'num_reference' => 'REF-1004',
                'stock' => 40,
                'price' => 15.00,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/3ms0N4fr/whiskey.png',
                'categoria' => categoryProducts::vodka->value,
                'shelf_id' => $shelfId,
                'is_visible' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
