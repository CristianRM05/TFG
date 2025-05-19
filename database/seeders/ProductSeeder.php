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
                'name' => 'Whiskey Swapify 12 Años',
                'description' => 'Whiskey single malt añejado durante 12 años. Notas especiadas con toques de vainilla y ahumado. Ideal para paladares exigentes.',
                'num_reference' => 'REF-2001',
                'stock' => 25,
                'price' => 45.90,
                'discount_percent' => 5,
                'image_url' => 'https://i.ibb.co/MxsbRXhD/etiqueta-Azul.png',
                'categoria' => categoryProducts::whiskey->value,
                'shelf_id' => 2,
                'is_visible' => true,
            ],
            [
                'name' => 'Tequila Swapify Reposado 100cl',
                'description' => 'Tequila reposado envejecido durante 12 meses. Sabor suave y equilibrado con notas de madera y agave cocido. 40% de alcohol.',
                'num_reference' => 'REF-2002',
                'stock' => 30,
                'price' => 32.50,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/r2C9jVNr/etiqueta-Negra.png',
                'categoria' => categoryProducts::tequila->value,
                'shelf_id' => 1,
                'is_visible' => true,
            ],
            [
                'name' => 'Swapify Scotch Whisky 18 Años',
                'description' => 'Single Malt escocés con 18 años de añejamiento y un exclusivo acabado en doble barrica de jerez. 43% de alcohol y un sabor profundo con notas dulces y especiadas.',
                'num_reference' => 'REF-2004',
                'stock' => 15,
                'price' => 74.90,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/tw4Lbppk/scotch-Whisky.png',
                'categoria' => categoryProducts::whiskey->value,
                'shelf_id' => 5,
                'is_visible' => true,
            ],
            [
                'name' => 'Swapify Single Malt 12 Años',
                'description' => 'Whiskey escocés envejecido 12 años en barricas de roble. Perfil de sabor ahumado con toques de vainilla y caramelo. Embotellado en Escocia. 43% Vol.',
                'num_reference' => 'REF-2005',
                'stock' => 28,
                'price' => 42.00,
                'discount_percent' => 10,
                'image_url' => 'https://i.ibb.co/SwTh3vZY/malt-Whiskey.png',
                'shelf_id' => 4,
                'categoria' => categoryProducts::whiskey->value,
                'is_visible' => true,
            ],
            [
                'name' => 'Swapify Whiskey Single Malt 12 Años',
                'description' => 'Whiskey single malt añejado durante 12 años en barricas de roble. Con un perfil aromático ahumado, toques de vainilla y caramelo, este whiskey representa la sofisticación clásica.',
                'num_reference' => 'REF-2006',
                'stock' => 22,
                'price' => 44.90,
                'discount_percent' => 5,
                'image_url' => 'https://i.ibb.co/3ms0N4fr/whiskey.png',
                'categoria' => categoryProducts::licor->value,
                'shelf_id' =>3,
                'is_visible' => true,
            ],
            [
                'name' => 'Swapify Gin Botanical Edition',
                'description' => 'Ginebra tipo London Dry destilada con 8 botánicos seleccionados: enebro, cilantro, cáscara de cítricos y más. Refrescante, aromática y perfecta para cócteles clásicos.',
                'num_reference' => 'REF-2007',
                'stock' => 35,
                'price' => 29.90,
                'discount_percent' => 0,
                'image_url' => 'https://i.ibb.co/4gPnr9Jw/swapify-Gin.png',
                'categoria' => categoryProducts::ginebra->value,
                'shelf_id' => 2,
                'is_visible' => true,
            ],
            [
                'name' => 'Swapify Gin Rosé Edition',
                'description' => 'Ginebra aromática con infusión de frutas rojas y pétalos de rosa. Perfecta para cócteles suaves y elegantes. Un sabor fresco con un toque floral.',
                'num_reference' => 'REF-2008',
                'stock' => 40,
                'price' => 31.50,
                'discount_percent' => 5,
                'image_url' => 'https://i.ibb.co/v4FgZZC6/ginebra-Rosa.png',
                'categoria' => categoryProducts::ginebra->value,
                'shelf_id' => 1,
                'is_visible' => true,
            ],



        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
