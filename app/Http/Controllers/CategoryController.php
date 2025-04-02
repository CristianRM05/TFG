<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enums\categoryProducts;
class CategoryController extends Controller
{

    public function index()
    {
        $categorias = collect(categoryProducts::cases())
            ->map(fn($categoria) => [
                'name' => $categoria->name,
                'value' => $categoria->value,
            ]);

        return response()->json($categorias);
    }

}
