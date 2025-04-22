<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ListEmployeeController extends Controller
{
    public function index(){
        $employees = User::whereIn('role', ['Operario', 'Repartidor'])->get();
        return response()->json($employees);
    }
}
