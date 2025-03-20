<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Enums\RolesEmployee;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'number_employ' => 'EMP001',
            'name' => 'Administador',
            'last_name' => 'admin',
            'dni' => '12345678A',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'phone' => '123456789',
            'address' => 'Calle Falsa 123',
            'roles' => RolesEmployee::Admin,
            'photograph' => 'profile.jpg',
            'license' => 'L12345',
            'driver_license' => 'B',
            'license_expiration_date' => '2026-05-20',
        ]);
    }
}
