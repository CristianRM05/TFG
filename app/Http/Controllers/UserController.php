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
        ]);

        // Procesar fotografía (si se envió)
        if ($request->hasFile('photograph')) {
            $validated['photograph'] = $request->file('photograph')->store('photos', 'public');
        }

        // Crear usuario
        $user = User::create($validated);

        // Enviar correo con las credenciales
        $user->notify(new NewUserCredentialsNotification($plainPassword));

        return redirect()->back()->with('success', 'Empleado creado y credenciales enviadas por correo.');
    }
}
