import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getProducts, addToCart, getCategories } from '@/services/productService';
import { Product } from '@/types/products';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ChevronLeft, ChevronRight, Search, Filter, ShoppingCart } from 'lucide-react';
import debounce from 'lodash/debounce';
const MySwal = withReactContent(Swal);

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('todas');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [inputValue, setInputValue] = useState(''); // valor del input sin filtro inmediato
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
            setCurrentPage(1); // opcional, si quieres volver a la página 1
        }, 1000),
        []
    );
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts(currentPage, searchTerm, categoryFilter, minPrice, maxPrice);
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
    }, [currentPage, searchTerm, categoryFilter, minPrice, maxPrice]);

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

    const [categories, setCategories] = useState<{ value: string; name: string }[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories([{ value: 'todas', name: 'Todas' }, ...data]);
            } catch {
                console.error('Error al cargar categorías');
            }
        };

        fetchCategories();
    }, []);

    const filtered = useMemo(() => {
        const min = minPrice !== '' ? parseFloat(minPrice) : 0;
        const max = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
        return products.filter(p => {
            const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = categoryFilter === 'todas' || p.categoria === categoryFilter;
            const matchesPrice = p.price >= min && p.price <= max;
            const isVisible = p.is_visible !== false;
            const hasStock = (p.stock ?? 0) > 0;
            return matchesName && matchesCat && matchesPrice && isVisible && hasStock;
        });
    }, [products, searchTerm, categoryFilter, minPrice, maxPrice]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-8 border-[#E17100] rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-transparent border-t-[#E17100] border-r-[#E17100] rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-[#E17100] rounded-full opacity-30 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Barra de búsqueda responsive en la parte superior */}
            <div className="py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    <div className="flex flex-col space-y-4">
                        {/* Barra de búsqueda principal - responsive */}
                        <div className="flex items-stretch bg-white rounded-full shadow-md overflow-hidden border-2 border-[#E17100]">
                            <div className="pl-3 sm:pl-4 flex items-center text-[#E17100]">
                                <Search size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={inputValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setInputValue(value);     // actualiza el valor del input
                                    debouncedSearch(value);  // actualiza el filtro con retardo
                                }}
                                className="flex-grow px-2 sm:px-4 py-2 sm:py-3 outline-none text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                            />
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-2 sm:px-3 py-2 sm:py-3 bg-[#E17100] text-white font-semibold hover:bg-opacity-90 transition-colors flex items-center text-sm sm:text-base"
                            >
                                <Filter size={16} className="sm:w-5 sm:h-5 mr-1" />
                                <span className="hidden xs:inline">Filtro</span>
                            </button>
                        </div>

                        {/* Panel de filtros expandible - responsive */}
                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-md animate-fadeIn">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 bg-[#F3F3DF] rounded-lg px-3 py-2">
                                    <label className="font-medium text-gray-700 text-sm sm:text-base whitespace-nowrap">Categoría:</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="flex-grow bg-transparent outline-none border-none text-sm sm:text-base"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 bg-[#F3F3DF] rounded-lg px-3 py-2">
                                    <label className="font-medium text-gray-700 text-sm sm:text-base whitespace-nowrap">Precio mín:</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const num = parseFloat(value);
                                            if (value === '' || (num >= 0 && num <= 9999)) {
                                                setMinPrice(value);
                                            } else {
                                                MySwal.fire({
                                                    icon: 'warning',
                                                    title: 'Valor inválido',
                                                    text: 'El precio mínimo debe estar entre 0 y 9999.',
                                                    confirmButtonColor: '#E17100'
                                                });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault(); // bloquea negativo y notación científica
                                            }
                                        }}
                                        className="flex-grow bg-transparent outline-none border-none text-sm sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 bg-[#F3F3DF] rounded-lg px-3 py-2 sm:col-span-2 lg:col-span-1">
                                    <label className="font-medium text-gray-700 text-sm sm:text-base whitespace-nowrap">Precio máx:</label>
                                    <input
                                        type="number"
                                        placeholder="∞"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const num = parseFloat(value);
                                            if (value === '' || (num >= 0 && num <= 9999)) {
                                                setMaxPrice(value);
                                            } else {
                                                MySwal.fire({
                                                    icon: 'warning',
                                                    title: 'Valor inválido',
                                                    text: 'El precio máximo debe estar entre 0 y 9999.',
                                                    confirmButtonColor: '#E17100'
                                                });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "e" || e.key === "E") {
                                                e.preventDefault(); // bloquea negativo y notación científica
                                            }
                                        }}
                                        className="flex-grow bg-transparent outline-none border-none text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido principal - responsive */}
            <div className="max-w-7xl mx-auto flex-grow px-2 sm:px-4 mt-4 sm:mt-8">
                {products.length === 0 ? (
                    <p className="text-center text-gray-600 text-base sm:text-lg">
                        No hay productos disponibles.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                        {products.map((product) => {
                            const hasDiscount = product.discount_percent && product.discount_percent > 0;
                            const finalPrice = hasDiscount
                                ? product.price * (1 - product.discount_percent / 100)
                                : product.price;

                            return (
                                <div key={product.id} className="flex flex-col justify-end p-4 sm:p-8 rounded-xl bg-[#F3F3DF]/50 hover:bg-[#F3F3DF]/95 text-gray-900 transition-all duration-300 hover:shadow-xl">
                                    <div className="flex-1 flex items-center justify-center mb-4 sm:mb-6">
                                        <img
                                            src={product.image_url || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="max-h-48 sm:max-h-80 object-contain transition-transform duration-300 hover:scale-105"
                                            onError={e => (e.currentTarget.src = '/fallback.jpg')}
                                        />
                                    </div>

                                    <h2 className="text-xl sm:text-3xl font-bold uppercase mb-2 text-[#E17100] leading-tight">{product.name}</h2>

                                    <div className="mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
                                        {hasDiscount ? (
                                            <>
                                                <span className="text-xl sm:text-2xl font-bold text-[#E17100]">${finalPrice.toFixed(2)}</span>
                                                <span className="text-base sm:text-lg line-through text-gray-500">${product.price.toFixed(2)}</span>
                                                <span className="bg-[#E17100] text-white px-2 py-1 rounded-full text-xs">
                                                    {product.discount_percent}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl sm:text-2xl font-bold text-[#E17100]">${product.price.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <p className="mb-4 sm:mb-6 text-gray-700 leading-relaxed text-sm sm:text-base">{product.description}</p>

                                    {/* Botón "Add to Cart" y Stock - responsive */}
                                    <div className="flex flex-col items-start space-y-2">
                                        {(product.stock ?? 0) > 0 && (
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold uppercase tracking-wide transition bg-[#E17100] text-white hover:bg-opacity-90 w-full flex items-center justify-center text-sm sm:text-base"
                                            >
                                                <ShoppingCart size={16} className="sm:w-5 sm:h-5 mr-2" />
                                                Añadir al carrito
                                            </button>
                                        )}

                                        {/* Indicador si esta disponible o no */}
                                        {(product.stock ?? 0) > 0 ? (
                                            <p className="text-xs sm:text-sm text-green-600 w-full text-center">
                                                Disponible
                                            </p>
                                        ) : (
                                            <p className="text-xs sm:text-sm text-red-600 w-full text-center">
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

            {/* Paginación - responsive */}
            {lastPage > 1 && (
                <div className="max-w-7xl mx-auto mt-6 sm:mt-8 mb-6 sm:mb-8 px-2 sm:px-4">
                    <div className="flex justify-center space-x-2 sm:space-x-4">
                        <button
                            className={`px-3 sm:px-5 py-2 rounded-full font-semibold transition-colors flex items-center text-sm sm:text-base ${currentPage === 1
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-[#E17100] text-white hover:bg-opacity-90'
                                }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} className="sm:w-5 sm:h-5 mr-1" />
                            <span className="hidden xs:inline">Anterior</span>
                            <span className="xs:hidden">Ant</span>
                        </button>

                        <span className="flex items-center justify-center bg-[#F3F3DF] px-3 sm:px-4 py-2 rounded-full font-semibold text-gray-900 text-sm sm:text-base">
                            {currentPage} / {lastPage}
                        </span>

                        <button
                            className={`px-3 sm:px-5 py-2 rounded-full font-semibold transition-colors flex items-center text-sm sm:text-base ${currentPage === lastPage
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-[#E17100] text-white hover:bg-opacity-90'
                                }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            <span className="hidden xs:inline">Siguiente</span>
                            <span className="xs:hidden">Sig</span>
                            <ChevronRight size={16} className="sm:w-5 sm:h-5 ml-1" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
