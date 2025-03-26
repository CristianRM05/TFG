<?php

namespace App\Http\Controllers;

use App\Enums\RolesEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboardAdmin', [
            'roles' => RolesEmployee::casesArray(),
        ]);
    }
}
