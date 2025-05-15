import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, addToCart } from '@/services/productService';
import { Product } from '@/types/products';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MySwal = withReactContent(Swal);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(currentPage);
        setProducts(data.data);
        setLastPage(data.last_page);
      } catch {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cargar los productos.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) setCurrentPage(page);
  };

  const handleAddToCart = async (id: number) => {
    try {
      await addToCart(id);
      MySwal.fire({ icon: 'success', title: '¡Producto añadido!', timer: 2000, showConfirmButton: false });
    } catch {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo añadir el producto.' });
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.categoria)));
    return ['todas', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    const min = minPrice !== '' ? parseFloat(minPrice) : 0;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
    return products.filter(p => {
      const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === 'todas' || p.categoria === categoryFilter;
      const matchesPrice = p.price >= min && p.price <= max;
      const isVisible = p.is_visible !== false;
      const hasStock = p.stock > 0;
      return matchesName && matchesCat && matchesPrice && isVisible && hasStock;
    });
  }, [products, searchTerm, categoryFilter, minPrice, maxPrice]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-8 border-[#7C5F42] rounded-full"></div>
          <div className="absolute inset-0 border-8 border-transparent border-t-[#8F5C0C] border-r-[#8F5C0C] rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-[#8F5C0C] rounded-full opacity-30 animate-pulse"></div>
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-[#F3F3F1] text-[#000000] py-12 px-6 flex flex-col">
            {/* Paneles de productos */}
            <div className="max-w-7xl mx-auto flex-grow">
                {products.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">
                        No hay productos disponibles.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map((product) => {
                            const hasDiscount = product.discount_percent && product.discount_percent > 0;
                            const finalPrice = hasDiscount
                                ? product.price * (1 - product.discount_percent / 100)
                                : product.price;

              return (
                <div key={product.id} className="flex flex-col justify-end p-8 rounded-xl bg-[#F3F3F1] text-gray-900 transition-all duration-300 hover:shadow-xl">
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <img
                      src={product.image_url || '/placeholder.jpg'}
                      alt={product.name}
                      className="max-h-80 object-contain transition-transform duration-300 hover:scale-105"
                      onError={e => (e.currentTarget.src = '/fallback.jpg')}
                    />
                  </div>

                  <h2 className="text-3xl font-bold uppercase mb-2 text-[#8F5C0C]">{product.name}</h2>

                  <div className="mb-4 flex items-center">
                    {hasDiscount ? (
                      <>
                        <span className="text-2xl font-bold text-[#8F5C0C] mr-4">${finalPrice.toFixed(2)}</span>
                        <span className="text-lg line-through text-gray-500 mr-2">${product.price.toFixed(2)}</span>
                        <span className="bg-[#8F5C0C] text-white px-2 py-1 rounded-full text-xs">
                          {product.discount_percent}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-[#8F5C0C]">${product.price.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="mb-6 max-w-prose text-[#7C5F42] leading-relaxed">{product.description}</p>

                                    {/* Botón "Add to Cart" y Stock */}
                                    <div className="flex flex-col items-start space-y-2">
                                        {product.stock > 0 && (
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className={`
                              px-6 py-3 rounded-full font-semibold uppercase tracking-wide transition
                              bg-[#8F5C0C] text-white hover:bg-opacity-90
                              w-full
                            `}
                                            >
                                                Add to Cart
                                            </button>
                                        )}

                                        {/* Indicador si esta disponible o no */}
                                        {product.stock > 0 ? (
                                            <p className="text-sm text-green-600 w-full text-center">
                                                 disponibles
                                            </p>
                                        ) : (
                                            <p className="text-sm text-red-600 w-full text-center">
                                                Agotado
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

      {lastPage > 1 && (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex justify-center space-x-4">
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-colors ${currentPage === 1
                ? 'bg-gray-300 text-gray-500'
                : 'bg-amber-600 text-black hover:bg-amber-500'
                }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span className="flex items-center justify-center bg-gray-100 px-4 py-2 rounded-full font-semibold text-gray-900">
              {currentPage} / {lastPage}
            </span>

            <button
              className={`px-5 py-2 rounded-full font-semibold transition-colors ${currentPage === lastPage
                ? 'bg-gray-300 text-gray-500'
                : 'bg-amber-600 text-black hover:bg-amber-500'
                }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
