<?php

namespace App\Http\Controllers;

use App\Enums\RolesEmployee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManagerDashboardController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboardManager', [
            'roles' => RolesEmployee::casesArray(),
        ]);
    }
    
}
