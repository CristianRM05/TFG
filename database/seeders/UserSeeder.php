<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\RolesEmployee;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Operarios
        User::create([
            'number_employ' => 'EMP101',
            'name' => 'Operario Uno',
            'last_name' => 'Apellido Uno',
            'dni' => '11111111A',
            'email' => 'operario1@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000001',
            'address' => 'Calle Uno 123',
            'role' => RolesEmployee::Operator->value,
            'photograph' => 'profile.jpg',
            'remember_token' => Str::random(10),
        ]);

        User::create([
            'number_employ' => 'EMP102',
            'name' => 'Operario Dos',
            'last_name' => 'Apellido Dos',
            'dni' => '22222222B',
            'email' => 'operario2@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000002',
            'address' => 'Calle Dos 123',
            'role' => RolesEmployee::Operator->value,
            'photograph' => 'profile.jpg',
            'remember_token' => Str::random(10),
        ]);

        User::create([
            'number_employ' => 'EMP103',
            'name' => 'Operario Tres',
            'last_name' => 'Apellido Tres',
            'dni' => '33333333C',
            'email' => 'operario3@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000003',
            'address' => 'Calle Tres 123',
            'role' => RolesEmployee::Operator->value,
            'photograph' => 'profile.jpg',
            'remember_token' => Str::random(10),
        ]);

        // Repartidores
        User::create([
            'number_employ' => 'EMP201',
            'name' => 'Repartidor Uno',
            'last_name' => 'Apellido Uno',
            'dni' => '44444444D',
            'email' => 'repartidor1@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000004',
            'address' => 'Calle Cuatro 123',
            'role' => RolesEmployee::Dealer->value,
            'photograph' => 'profile.jpg',
            'license' => 'R111',
            'driver_license' => 'B',
            'license_expiration_date' => now()->addYear(),
            'remember_token' => Str::random(10),
        ]);

        User::create([
            'number_employ' => 'EMP202',
            'name' => 'Repartidor Dos',
            'last_name' => 'Apellido Dos',
            'dni' => '55555555E',
            'email' => 'repartidor2@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000005',
            'address' => 'Calle Cinco 123',
            'role' => RolesEmployee::Dealer->value,
            'photograph' => 'profile.jpg',
            'license' => 'R222',
            'driver_license' => 'B',
            'license_expiration_date' => now()->addYear(),
            'remember_token' => Str::random(10),
        ]);

        User::create([
            'number_employ' => 'EMP203',
            'name' => 'Repartidor Tres',
            'last_name' => 'Apellido Tres',
            'dni' => '66666666F',
            'email' => 'repartidor3@empresa.com',
            'password' => Hash::make('password'),
            'phone' => '600000006',
            'address' => 'Calle Seis 123',
            'role' => RolesEmployee::Dealer->value,
            'photograph' => 'profile.jpg',
            'license' => 'R333',
            'driver_license' => 'B',
            'license_expiration_date' => now()->addYear(),
            'remember_token' => Str::random(10),
        ]);
    }
}
