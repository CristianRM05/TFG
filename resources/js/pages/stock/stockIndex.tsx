import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { StockProduct } from '../../app';

interface Props {
    products: StockProduct[];
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

const StockIndex: React.FC<Props> = ({ products, auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<StockProduct[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (searchTerm.trim()) {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchTerm, products]);

    const navigateToProduct = (productId: number) => {
        setShowResults(false);
        setSearchTerm('');
        router.visit(`/products/${productId}`);
    };

    return (
        <AppLayout
  user={auth.user}
  header={<h2 className="text-2xl font-bold text-white">Stock Management</h2>}
>
  <Head title="Stock Management" />

  <div className="min-h-screen bg-black text-white py-12">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
      {/* Título */}
      <h1 className="text-3xl font-extrabold">Inventario de Productos</h1>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) =>
            product.stocks?.map((stock, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
              >
                {/* Imagen y nombre */}
                <div className="flex items-center gap-4 mb-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/30"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-300">${product.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Ref:</span> {product.num_reference}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Ubicación:</span> {stock.location}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Capacidad Estanteria:</span>{' '}
                    {stock.shelf?.max_capacity ?? '–'}
                  </p>
                </div>

                {/* Stock y acciones */}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      stock.available_quantity <= 10
                        ? 'bg-red-700 text-white'
                        : 'bg-green-700 text-white'
                    }`}
                  >
                    {stock.available_quantity} uds.
                  </span>

                </div>
              </div>
            ))
          )
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No hay productos en stock.
          </p>
        )}
      </div>
    </div>
  </div>
</AppLayout>


    );
};

export default StockIndex;

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

