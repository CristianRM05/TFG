<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\RolesEmployee;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'number_employ' => 'EMP001',
                'name' => 'Administrador',
                'last_name' => 'admin',
                'dni' => '12345678A',
                'email' => 'admin@admin.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'phone' => '123456789',
                'address' => 'Calle Falsa 123',
                'role' => 'Admin',
                'photograph' => 'profile.jpg',
                'license' => 'L12345',
                'driver_license' => 'B',
                'license_expiration_date' => '2026-05-20',
                'remember_token' => Str::random(10),
            ],
            [
                'number_employ' => 'EMP002',
                'name' => 'master',
                'last_name' => 'manager',
                'dni' => '12345678B',
                'email' => 'manager@manager.com',
                'email_verified_at' => now(),
                'password' => Hash::make('manager123'),
                'phone' => '123456780',
                'address' => 'Calle Falsa 123',
                'role' => 'Manager',
                'photograph' => 'profile.jpg',
                'license' => 'M12345',
                'driver_license' => 'B',
                'license_expiration_date' => '2026-05-20',
                'remember_token' => Str::random(10),
            ]
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $this->call([
            ShelfSeeder::class,
            ProductSeeder::class,
            TruckSeeder::class,
            UserSeeder::class,
        ]);
    }
}
