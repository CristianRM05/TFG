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
                'dni' => '12345678A',
                'email' => 'admin@admin.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'phone' => '123456789',
                'address' => 'Calle Falsa 123',
                'role' => 'Admin',
                'photograph' => 'profile.jpg',
            ],
            [
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
            ]
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $this->call([
            ShelfSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
