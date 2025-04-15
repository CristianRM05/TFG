<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Truck;
use App\Enums\StatusTruck;

class TruckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Truck::create([
            'license_plate' => '1111ABC',
            'max_capacity' => 2000,
            'status' => StatusTruck::Disponible,
        ]);

        Truck::create([
            'license_plate' => '2222DEF',
            'max_capacity' => 1500,
            'status' => StatusTruck::Ocupado,
        ]);

        Truck::create([
            'license_plate' => '3333GHI',
            'max_capacity' => 3000,
            'status' => StatusTruck::Mantenimiento,
        ]);
    }
}
