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
        // User::factory(10)->create();

        $users = [
            [
                'name' => 'Administrador',
                'last_name' => 'admin',
                'email' => 'admin@admin.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'phone' => '123456789',
                'location' => 'Calle Falsa 123',
                'role' => 'Admin',
                'avatar' => 'profile.jpg', // cambiado de 'photograph' a 'avatar'
                'external_id' => null,
                'external_auth' => null,
            ],
            [
                'name' => 'master',
                'last_name' => 'manager',
                'email' => 'manager@manager.com',
                'email_verified_at' => now(),
                'password' => Hash::make('manager123'),
                'phone' => '123456780',
                'location' => 'Calle Falsa 123',
                'role' => 'Manager',
                'avatar' => 'profile.jpg', // cambiado
                'external_id' => null,
                'external_auth' => null,
            ],
            [
                'name' => 'cliente',
                'last_name' => 'cliente',
                'email' => 'cliente@cliente.com',
                'email_verified_at' => now(),
                'password' => Hash::make('cliente123'),
                'phone' => '123456781',
                'location' => 'Calle Falsa 123',
                'role' => 'Cliente',
                'avatar' => 'profile.jpg', // cambiado
                'external_id' => null,
                'external_auth' => null,
            ]
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $this->call([
            ShelfSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
