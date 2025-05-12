<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShelfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shelves = [
            [
                'code' => 'SH-001',
                'location' => 'Pasillo A, Sección 1',
                'max_capacity' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SH-002',
                'location' => 'Pasillo A, Sección 2',
                'max_capacity' => 150,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SH-003',
                'location' => 'Pasillo B, Sección 1',
                'max_capacity' => 200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SH-004',
                'location' => 'Pasillo B, Sección 2',
                'max_capacity' => 120,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SH-005',
                'location' => 'Pasillo C, Sección 1',
                'max_capacity' => 180,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('shelves')->insert($shelves);
    }
}
