import { Head, usePage, router, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { Product, Shelf, SharedData } from '@/types';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Pagination } from "@/components/pagination"

interface Props extends SharedData {
    shelf: Shelf & {
        products: Product[];
    };
}

export default function ShelfShow({ shelf }: Props) {
    const { auth, flash } = usePage<SharedData & { flash?: { success?: string; error?: string } }>().props;
    const [products, setProducts] = useState(
        shelf.products?.filter(product => product.stock > 0) || []
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Show success message when flash changes
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: '¡Éxito!',
                text: flash.success,
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: 'top',
                showConfirmButton: false
            });
        } else if (flash?.error) {
            Swal.fire({
                title: 'Error',
                text: flash.error,
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: 'top',
                showConfirmButton: false
            });
        }
    }, [flash]);

    const handleRemoveFromShelf = async (productId: number) => {
        Swal.fire({
            title: '¿Quitar producto?',
            text: '¿Estás seguro que quieres quitar este producto de la estantería?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, quitar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('products.remove-merge', { product: productId }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setProducts(prev => prev.filter(p => p.id !== productId));
                        Swal.fire({
                            title: '¡Eliminado!',
                            text: 'El producto ha sido quitado de la estantería.',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: 'top',
                            showConfirmButton: false
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al desasignar el producto',
                            icon: 'error',
                            confirmButtonColor: '#3085d6'
                        });
                        console.error('Error detallado:', errors);
                    }
                });
            }
        });
    };

    // Calculate capacity percentage for progress bar
    const getCapacityPercentage = () => {
        if (!shelf.max_capacity) return 0;
        const currentStock = products.reduce((total, p) => total + p.stock, 0) || 0;
        return Math.min(100, Math.round((currentStock / shelf.max_capacity) * 100));
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Detalles de Estantería</h2>}
        >
            <Head title={`Estantería ${shelf.location}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            {/* Shelf details card */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                    <div>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 mb-2">
                                            Código: {shelf.code}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{shelf.location}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {products.length} producto{products.length !== 1 ? 's' : ''} asignado{products.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    {shelf.max_capacity && (
                                        <div className="mt-4 md:mt-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacidad de la estantería</h4>
                                            <div className="flex items-end gap-2">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {products.reduce((total, p) => total + p.stock, 0) || 0}
                                                </div>
                                                <div className="text-gray-500 dark:text-gray-400 text-sm">
                                                    de {shelf.max_capacity} unidades
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mt-2">
                                                <div
                                                    className={`h-2.5 rounded-full ${getCapacityPercentage() > 90
                                                            ? 'bg-red-600'
                                                            : getCapacityPercentage() > 70
                                                                ? 'bg-yellow-400'
                                                                : 'bg-green-600'
                                                        }`}
                                                    style={{ width: `${getCapacityPercentage()}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Productos en esta estantería
                            </h4>

                            {products.length ? (
                                <>
                                    <div className="space-y-4">
                                        {currentProducts.map(product => (
                                            <div key={product.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-start">
                                                        {product.image_url && (
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={product.image_url || "/placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="h-16 w-16 rounded-md object-cover mr-4"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h5 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h5>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {product.num_reference}</p>
                                                            <div className="mt-1">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                    Stock: {product.stock} unidades
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveFromShelf(product.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        No hay productos con stock disponible en esta estantería.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6">
                                <Link
                                    href={route('shelves.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Volver a estanterías
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
