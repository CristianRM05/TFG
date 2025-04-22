<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Enums\categoryProducts;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Coca-Cola Original',
                'description' => 'Refresco carbonatado clásico.',
                'num_reference' => 'REF-001',
                'stock' => 100,
                'price' => 1.20,
                'discount_percent' => 0,
                'image_url' => 'storage/products/coca_cola.jpg',
                'categoria' => categoryProducts::refresco,
            ],
            [
                'name' => 'Ron Barceló Añejo',
                'description' => 'Ron dominicano envejecido en barricas de roble.',
                'num_reference' => 'RON-002',
                'stock' => 50,
                'price' => 12.50,
                'discount_percent' => 10,
                'image_url' => 'storage/products/ron_barcelo.jpg',
                'categoria' => categoryProducts::ron,
            ],
            [
                'name' => 'Heineken',
                'description' => 'Cerveza tipo lager de origen holandés.',
                'num_reference' => 'CERV-003',
                'stock' => 200,
                'price' => 1.80,
                'discount_percent' => 5,
                'image_url' => 'storage/products/heineken.jpg',
                'categoria' => categoryProducts::cerveza,
            ],
            [
                'name' => 'Monster Energy',
                'description' => 'Bebida energética para mantenerse activo.',
                'num_reference' => 'ENER-004',
                'stock' => 150,
                'price' => 2.00,
                'discount_percent' => 0,
                'image_url' => 'storage/products/monster.jpg',
                'categoria' => categoryProducts::energetico,
            ],
            [
                'name' => 'Vodka Absolut',
                'description' => 'Vodka sueco premium destilado de trigo.',
                'num_reference' => 'VOD-005',
                'stock' => 70,
                'price' => 14.00,
                'discount_percent' => 15,
                'image_url' => 'storage/products/absolut.jpg',
                'categoria' => categoryProducts::vodka,
            ],

        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
