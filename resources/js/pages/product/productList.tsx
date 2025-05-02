import React, { useEffect, useState } from 'react';
import { getProducts, addToCart } from '@/services/productService';
import { Product } from '@/types/products';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(currentPage);
                setProducts(data.data);
                setLastPage(data.last_page);
            } catch (error) {
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
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleAddToCart = async (productId: number) => {
        try {
            await addToCart(productId);
            MySwal.fire({
                icon: 'success',
                title: '¡Producto añadido!',
                text: 'Producto añadido al carrito correctamente.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo añadir el producto al carrito.',
            });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white py-12 px-6 flex flex-col">
          {/* Paneles de productos */}
          <div className="max-w-7xl mx-auto flex-grow">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                No hay productos disponibles.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`
                      flex flex-col justify-end p-8
                      bg-white dark:bg-black
                      text-gray-900 dark:text-white
                    `}
                  >
                    {/* Imagen centrada */}
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={
                          product.image_url ||
                          'https://img.freepik.com/vector-premium/signo-interrogacion-rojo-grande_122818-781.jpg'
                        }
                        alt={product.name}
                        className="max-h-80 object-contain"
                        onError={e =>
                          (e.currentTarget.src =
                            'https://img.freepik.com/vector-premium/signo-premium_981.png')
                        }
                      />
                    </div>

                    {/* Nombre y precio */}
                    <h2 className="text-4xl font-extrabold uppercase mb-2">
                      {product.name}
                    </h2>
                    <p className="text-2xl font-semibold mb-4">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Descripción */}
                    <p className="mb-6 max-w-prose text-sm leading-relaxed">
                      {product.description}
                    </p>

                    {/* Botón “Add to Cart” */}
                    {product.stock > 0 && (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className={`
                          px-6 py-3 rounded-full font-semibold uppercase tracking-wide transition
                          bg-amber-600 text-black hover:bg-amber-500
                        `}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginación */}
          <div className="max-w-7xl mx-auto mt-8">
            <div className="flex justify-center space-x-4">
              <button
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-amber-600 text-black hover:bg-amber-500'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              <span className="flex items-center justify-center bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-full font-semibold text-gray-900 dark:text-white">
                {currentPage} / {lastPage}
              </span>

              <button
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  currentPage === lastPage
                    ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-amber-600 text-black hover:bg-amber-500'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      );


    };

export default ProductList;
