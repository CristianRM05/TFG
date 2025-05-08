<?php

namespace App\Http\Controllers;

use App\Enums\RolesEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Shelf; 

class AdminDashboardController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboardAdmin', [
            'roles' => RolesEmployee::casesArray(),
        ]);
    }

public function banUser(User $user, Request $request)
{
    $request->validate([
        'banned' => 'required|boolean'
    ]);

    $request->banned ? $user->ban() : $user->unban();

    // Devuelve una respuesta Inertia en lugar de JSON puro
    return back()->with([
        'success' => true,
        'message' => $request->banned 
            ? 'Usuario baneado correctamente' 
            : 'Usuario desbaneado correctamente',
        'user' => $user->fresh()
    ]);

    
}    public function storeShelf(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:shelves',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|numeric|min:1',
        ]);

        $shelf = Shelf::create($validated);

        return back()->with([
            'success' => true,
            'message' => 'Estantería creada con éxito',
            'shelf' => $shelf
        ]);

}

}