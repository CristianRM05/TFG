<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ImagenController extends Controller
{
    public function subirImagen(Request $request)
    {
        try {
            $request->validate([
                'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:32000'
            ]);

            $imagen = $request->file('imagen');

            if (!$imagen) {
                return response()->json(['error' => 'No se ha recibido la imagen.'], 400);
            }
            $imagenCodificada = base64_encode(file_get_contents($imagen->getRealPath()));

            // Subir imagen a ImgBB
            $response = Http::asMultipart()->post("https://api.imgbb.com/1/upload", [
                'key' => env('IMGBB_API_KEY'),
                'image' => $imagenCodificada
            ]);

            $data = $response->json();

            if (isset($data['data']['url'])) {
                return response($data['data']['url']);
            } else {
                return response()->json([
                    'error' => 'Error al subir la imagen.',
                    'detalle' => $data
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno del servidor.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}
