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
        Product::insert([
            [
                'name' => 'Sudadera con capucha',
                'description' => 'Sudadera suave y cálida, ideal para climas fríos.',
                'num_reference' => 'REF006',
                'weight' => 0.5,
                'volume' => 0.02,
                'price' => 34.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Auriculares inalámbricos',
                'description' => 'Auriculares Bluetooth con cancelación de ruido.',
                'num_reference' => 'REF007',
                'weight' => 0.2,
                'volume' => 0.01,
                'price' => 59.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Botella térmica',
                'description' => 'Botella de acero inoxidable que mantiene las bebidas frías o calientes.',
                'num_reference' => 'REF008',
                'weight' => 0.4,
                'volume' => 0.01,
                'price' => 14.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gafas de sol',
                'description' => 'Gafas con protección UV400 para proteger tus ojos del sol.',
                'num_reference' => 'REF009',
                'weight' => 0.1,
                'volume' => 0.002,
                'price' => 19.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cargador portátil',
                'description' => 'Batería externa de 10.000mAh para cargar tus dispositivos en cualquier lugar.',
                'num_reference' => 'REF010',
                'weight' => 0.25,
                'volume' => 0.005,
                'price' => 29.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gorra deportiva',
                'description' => 'Gorra ligera y transpirable para actividades al aire libre.',
                'num_reference' => 'REF011',
                'weight' => 0.15,
                'volume' => 0.01,
                'price' => 9.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Camiseta técnica',
                'description' => 'Camiseta transpirable ideal para entrenamientos.',
                'num_reference' => 'REF012',
                'weight' => 0.2,
                'volume' => 0.008,
                'price' => 14.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Funda para portátil',
                'description' => 'Funda acolchada para proteger tu portátil de hasta 15”.',
                'num_reference' => 'REF013',
                'weight' => 0.3,
                'volume' => 0.02,
                'price' => 17.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Reloj analógico',
                'description' => 'Reloj clásico con correa de cuero genuino.',
                'num_reference' => 'REF014',
                'weight' => 0.2,
                'volume' => 0.004,
                'price' => 49.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mochila para portátil',
                'description' => 'Mochila ergonómica con compartimento acolchado para portátil.',
                'num_reference' => 'REF015',
                'weight' => 0.9,
                'volume' => 0.03,
                'price' => 39.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
