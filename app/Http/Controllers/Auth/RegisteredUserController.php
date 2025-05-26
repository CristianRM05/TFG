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
use App\Enums\RolesEmployee;


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
        'email' => 'required|email|unique:users,email',
        'phone' => ['required', 'regex:/^[0-9]{9}$/'],
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
        'avatar' => 'nullable|string|max:2048',
        'location' => 'nullable|string|max:255',
    ]);

    // Hashear la contraseña
    $validated['password'] = Hash::make($validated['password']);

    // Crear el usuario
    $user = User::create($validated);

    event(new Registered($user));
    Auth::login($user);

    return to_route('dashboard');
}

}
