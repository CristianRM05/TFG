<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;


class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:users,dni',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'role' => [Rule::in(array_column(RolesEmployee::cases(), 'Operario'))],
            'departamento_id' => 'nullable|exists:departamentos,id',
            'license' => 'nullable|string|max:50',
            'driver_license' => 'nullable|string|max:50',
            'license_expiration_date' => 'nullable|date',
            'password' => ['required', 'confirmed', Password::defaults()],
            'photograph' => 'nullable|image|max:2048',
        ]);


        // Subir foto si existe
        if ($request->hasFile('photograph')) {
            $validated['photograph'] = $request->file('photograph')->store('photos', 'public');
        }

        // Generar número de empleado

        // Hashear la contraseña
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        event(new Registered($user));
        Auth::login($user);

        return to_route('dashboard');
    }
}
