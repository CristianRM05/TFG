// components/ProductCard.tsx
import React, { FC, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import type { Product } from '@/types/products';
import { route } from 'ziggy-js';

interface ProductCardProps {
  product: Product;
  onAdd: (id: number) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAdd }) => {
  const handleImgError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = '/images/default-placeholder.png';
    },
    []
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-transform transform hover:-translate-y-1">
    {/* Cabecera con degradado y foto */}
    <div className="relative h-60 bg-gradient-to-br from-stone-900/10 to-stone-800/10">
      <img
        src={product.image_url || '/images/default-placeholder.png'}
        alt={product.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleImgError}
      />
      <span className="absolute bottom-3 left-3 bg-amber-600 text-white px-4 py-1 rounded-full text-base font-semibold shadow-md">
        €{(product.price ?? 0).toFixed(2)}
      </span>
    </div>

    {/* Cuerpo con nombre y botones */}
    <div className="p-6 flex flex-col justify-between h-52">
      <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
        {product.name}
      </h3>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onAdd(product.id)}
          disabled={(product.stock ?? 0) === 0}
          className={`flex-1 mr-4 px-5 py-2 rounded-2xl text-lg font-semibold transition
            ${
              (product.stock ?? 0) === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-500'
            }`}
        >
          🛒 Añadir al carrito
        </button>

        <Link
          href={route('products.show', product.id)}
          className="px-5 py-2 border-2 border-amber-600 text-amber-600 rounded-2xl hover:bg-amber-50 transition text-lg font-medium"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  </div>
    );
}


export default ProductCard;
