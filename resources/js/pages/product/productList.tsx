import { addToCart, getCategories, getProducts } from '@/services/productService';
import { Product } from '@/types/products';
import debounce from 'lodash/debounce';
import { ChevronLeft, ChevronRight, Filter, Search, ShoppingCart } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
        [],
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
        return products.filter((p) => {
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
            <div className="flex h-64 items-center justify-center">
                <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full border-8 border-[#E17100]"></div>
                    <div className="absolute inset-0 animate-spin rounded-full border-8 border-transparent border-t-[#E17100] border-r-[#E17100]"></div>
                    <div className="absolute inset-4 animate-pulse rounded-full bg-[#E17100] opacity-30"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-none dark:bg-none">
            {/* Barra de búsqueda responsive en la parte superior */}
            <div className="sticky top-0 z-10 py-4">
                <div className="mx-auto max-w-7xl px-2 sm:px-4">
                    <div className="flex flex-col space-y-4">
                        {/* Barra de búsqueda principal - responsive */}
                        <div className="flex items-stretch overflow-hidden rounded-full border-2 border-[#E17100] bg-white shadow-md">
                            <div className="flex items-center pl-3 text-[#E17100] sm:pl-4">
                                <Search size={20} className="sm:h-6 sm:w-6" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={inputValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setInputValue(value); // actualiza el valor del input
                                    debouncedSearch(value); // actualiza el filtro con retardo
                                }}
                                className="flex-grow px-2 py-2 text-sm text-gray-800 placeholder-gray-500 outline-none sm:px-4 sm:py-3 sm:text-base"
                            />
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="hover:bg-opacity-90 flex items-center bg-[#E17100] px-2 py-2 text-sm font-semibold text-white transition-colors sm:px-3 sm:py-3 sm:text-base"
                            >
                                <Filter size={16} className="mr-1 sm:h-5 sm:w-5" />
                                <span className="xs:inline hidden">Filtro</span>
                            </button>
                        </div>

                        {/* Panel de filtros expandible - responsive */}
                        {showFilters && (
                            <div className="animate-fadeIn grid grid-cols-1 gap-3 rounded-xl bg-white p-3 shadow-md sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3">
                                <div className="flex flex-col space-y-1 rounded-lg bg-[#F3F3DF] px-3 py-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                    <label className="text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">Categoría:</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="flex-grow border-none bg-transparent text-sm outline-none sm:text-base"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col space-y-1 rounded-lg bg-[#F3F3DF] px-3 py-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                    <label className="text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">Precio mín:</label>
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
                                                    confirmButtonColor: '#E17100',
                                                });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault(); // bloquea negativo y notación científica
                                            }
                                        }}
                                        className="flex-grow border-none bg-transparent text-sm outline-none sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col space-y-1 rounded-lg bg-[#F3F3DF] px-3 py-2 sm:col-span-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 lg:col-span-1">
                                    <label className="text-sm font-medium whitespace-nowrap text-gray-700 sm:text-base">Precio máx:</label>
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
                                                    confirmButtonColor: '#E17100',
                                                });
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault(); // bloquea negativo y notación científica
                                            }
                                        }}
                                        className="flex-grow border-none bg-transparent text-sm outline-none sm:text-base"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido principal - responsive */}
            <div className="mx-auto mt-4 max-w-7xl flex-grow px-2 sm:mt-8 sm:px-4">
                {products.length === 0 ? (
                    <p className="text-center text-base text-gray-600 sm:text-lg">No hay productos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
                        {products.map((product) => {
                            const hasDiscount = product.discount_percent && product.discount_percent > 0;
                            const finalPrice = hasDiscount ? product.price * (1 - product.discount_percent / 100) : product.price;

                            return (
                                <div
                                    key={product.id}
                                    className="flex flex-col justify-end rounded-xl bg-[#F3F3DF]/50 p-4 text-gray-900 transition-all duration-300 hover:bg-[#F3F3DF]/95 hover:shadow-xl sm:p-8"
                                >
                                    <div className="mb-4 flex flex-1 items-center justify-center sm:mb-6">
                                        <img
                                            src={product.image_url || '/placeholder.jpg'}
                                            alt={product.name}
                                            loading="lazy" // 👈 esto es lo que activa lazy load
                                            className="max-h-48 object-contain transition-transform duration-300 hover:scale-105 sm:max-h-80"
                                            onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                                        />
                                    </div>

                                    <h2 className="mb-2 text-xl leading-tight font-bold text-[#E17100] uppercase sm:text-3xl">{product.name}</h2>

                                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                                        {hasDiscount ? (
                                            <>
                                                <span className="text-xl font-bold text-[#E17100] sm:text-2xl">${finalPrice.toFixed(2)}</span>
                                                <span className="text-base text-gray-500 line-through sm:text-lg">${product.price.toFixed(2)}</span>
                                                <span className="rounded-full bg-[#E17100] px-2 py-1 text-xs text-white">
                                                    {product.discount_percent}% OFF
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold text-[#E17100] sm:text-2xl">${product.price.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:mb-6 sm:text-base">{product.description}</p>

                                    {/* Botón "Add to Cart" y Stock - responsive */}
                                    <div className="flex flex-col items-start space-y-2">
                                        {(product.stock ?? 0) > 0 && (
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="hover:bg-opacity-90 flex w-full items-center justify-center rounded-full bg-[#E17100] px-4 py-2 text-sm font-semibold tracking-wide text-white uppercase transition sm:px-6 sm:py-3 sm:text-base"
                                            >
                                                <ShoppingCart size={16} className="mr-2 sm:h-5 sm:w-5" />
                                                Añadir al carrito
                                            </button>
                                        )}

                                        {/* Indicador si esta disponible o no */}
                                        {(product.stock ?? 0) > 0 ? (
                                            <p className="w-full text-center text-xs font-semibold text-green-600 sm:text-sm dark:text-green-400">
                                                Disponible
                                            </p>
                                        ) : (
                                            <p className="w-full text-center text-xs text-red-600 sm:text-sm">Agotado</p>
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
                <div className="mx-auto mt-6 mb-6 max-w-7xl px-2 sm:mt-8 sm:mb-8 sm:px-4">
                    <div className="flex justify-center space-x-2 sm:space-x-4">
                        <button
                            className={`flex items-center rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-5 sm:text-base ${
                                currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'hover:bg-opacity-90 bg-[#E17100] text-white'
                            }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} className="mr-1 sm:h-5 sm:w-5" />
                            <span className="xs:inline hidden">Anterior</span>
                            <span className="xs:hidden">Ant</span>
                        </button>

                        <span className="flex items-center justify-center rounded-full bg-[#F3F3DF] px-3 py-2 text-sm font-semibold text-gray-900 sm:px-4 sm:text-base">
                            {currentPage} / {lastPage}
                        </span>

                        <button
                            className={`flex items-center rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-5 sm:text-base ${
                                currentPage === lastPage ? 'bg-gray-300 text-gray-500' : 'hover:bg-opacity-90 bg-[#E17100] text-white'
                            }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            <span className="xs:inline hidden">Siguiente</span>
                            <span className="xs:hidden">Sig</span>
                            <ChevronRight size={16} className="ml-1 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
