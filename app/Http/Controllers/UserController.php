<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\RolesEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Notifications\NewUserCredentialsNotification;


class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validar campos comunes
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dni' => 'required|string|unique:users,dni',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'role' => ['required', Rule::in(array_column(RolesEmployee::cases(), 'value'))],
            'photograph' => 'nullable|image|max:2048',
            'license' => 'nullable|string|max:100',
            'driver_license' => 'nullable|string|max:100',
            'license_expiration_date' => 'nullable|date',
        ]);

        // Si es Repartidor, asegurarse de que los campos obligatorios estén presentes
        if ($validated['role'] === RolesEmployee::Dealer->value) {
            $request->validate([
                'license' => 'required|string|max:100',
                'driver_license' => 'required|string|max:100',
                'license_expiration_date' => 'required|date',
            ]);
        } else {
            // Si no es repartidor, limpiar los campos por seguridad
            $validated['license'] = null;
            $validated['driver_license'] = null;
            $validated['license_expiration_date'] = null;
        }

        // Procesar fotografía (si se envió)
        if ($request->hasFile('photograph')) {
            $validated['photograph'] = $request->file('photograph')->store('photos', 'public');
        }

        // Generar número de empleado y contraseña
        $validated['number_employ'] = User::generateEmployeeNumber();
        $plainPassword = Str::random(12);
        $validated['password'] = Hash::make($plainPassword);

        // Crear usuario
        $user = User::create($validated);

        // Enviar correo con las credenciales
        $user->notify(new NewUserCredentialsNotification($plainPassword));

        return redirect()->back()->with('success', 'Empleado creado y credenciales enviadas por correo.');
    }
}
