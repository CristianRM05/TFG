// resources/js/Pages/Checkout/Cancel.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Cancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F3DF] text-center p-6">
      <h1 className="text-3xl font-bold text-[#E17100] mb-4">Pago cancelado</h1>
      <p className="text-lg text-gray-700 mb-6">
        Has cancelado el proceso de pago. Puedes volver al carrito y revisar tu pedido.
      </p>
      <Link
        href="/cart"
        className="bg-[#E58E33] hover:bg-[#E17100] text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Volver al carrito
      </Link>
    </div>
  );
}
