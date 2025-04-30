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
        <div className="container mx-auto mt-5 p-4 min-h-screen">
            <h2 className="text-center text-3xl font-bold mb-8 text-blue-800 relative">
                <span className="relative z-10">Refréscate con Nuestros Productos</span>
                <span className="absolute w-32 h-3 bg-red-400 bottom-0 left-1/2 transform -translate-x-1/2 -z-0 opacity-50"></span>
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-blue-800 text-lg">No hay productos disponibles.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                            key={product.id}
                        >
                            <div className="relative h-56 bg-gradient-to-r from-blue-100 to-blue-50">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://img.freepik.com/vector-premium/signo-interrogacion-rojo-grande_122818-781.jpg";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-blue-300 text-xl">🥤</span>
                                    </div>
                                )}

                                {/* Precio debajo de la imagen */}
                                <div className="absolute bottom-0 left-0 bg-red-600 text-white px-4 py-1 m-2 rounded-tr-xl font-semibold shadow-md text-sm">
                                    {product.price} €
                                </div>
                            </div>

                            <div className="p-5 border-t-4 border-blue-400 flex flex-col flex-grow justify-between">
                                <div>
                                    <h5 className="text-xl font-bold text-blue-700 mb-2">{product.name}</h5>
                                    <p className="text-gray-600 mb-3 text-sm">{product.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">


                                        <div className="bg-purple-100 px-3 py-1 rounded text-sm max-w-full inline-block">
                                            <span className="text-purple-800 font-medium">Categoría:</span>
                                            <span className="text-gray-700 ml-1">{product.categoria}</span>
                                        </div>

                                        <div className={`px-3 py-1 rounded text-sm font-medium ${product.stock === 0
                                                ? 'bg-gray-300 text-gray-700'
                                                : (product.stock ?? 0) <= 20
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {product.stock === 0
                                                ? 'No disponible'
                                                : (product.stock ?? 0) <= 20
                                                    ? '¡Quedan pocas unidades!'
                                                    : 'Disponible'}
                                        </div>
                                    </div>
                                </div>

                                {(product.stock ?? 0) > 0 && (
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full w-full font-bold tracking-wide shadow-md transition-colors flex items-center justify-center"
                                        onClick={() => handleAddToCart(product.id)}
                                    >
                                        <span className="mr-2">🛒</span> Añadir al Carrito
                                    </button>
                                )}

                            </div>
                        </div>


                    ))}
                </div>
            )}

            <div className="flex justify-center mt-8 space-x-4">
                <button
                    className={`px-5 py-2 rounded-full font-bold shadow-md transition-colors ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>

                <span className="flex items-center justify-center bg-white px-4 py-2 rounded-full font-bold shadow-md text-blue-700 min-w-12">
                    {currentPage} / {lastPage}
                </span>

                <button
                    className={`px-5 py-2 rounded-full font-bold shadow-md transition-colors ${currentPage === lastPage ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ProductList;
