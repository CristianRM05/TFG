import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { Product, Shelf, SharedData } from '@/types';
import { useState, useEffect } from 'react';

interface ShelvesPageProps extends SharedData {
    shelves: Shelf[];
    unassignedProducts: Product[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ShelvesIndex() {
    const {
        shelves,
        unassignedProducts,
        flash,
        auth
    } = usePage<ShelvesPageProps>().props;

    const [localProducts, setLocalProducts] = useState(
        unassignedProducts.filter(product => product.stock > 0)
    );
    const [showSuccess, setShowSuccess] = useState(false);

    // Update local products when props change
    useEffect(() => {
        setLocalProducts(unassignedProducts.filter(product => product.stock > 0));
    }, [unassignedProducts]);

    // Show success message when flash changes
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleAssignShelf = (productId: number, shelfId: string) => {
        if (!shelfId) return;

        // Optimistic update - remove the product immediately
        setLocalProducts(prev => prev.filter(p => p.id !== productId));

        router.put(route('products.assign-shelf', {
            product: productId
        }), {
            shelf_id: parseInt(shelfId)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Añade solo esta línea para mostrar el mensaje
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
            onError: () => {
                // Revert if there's an error
                setLocalProducts(unassignedProducts);
                alert('Error al asignar estantería');
            }
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Estanterías</h2>}
        >
            <Head title="Gestión de Estanterías" />

            {/* Floating success notification */}
            {showSuccess && (
                <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg mt-4">
                        Producto asignado correctamente
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Productos sin estantería */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                <span className="mr-2">📦</span>
                                Productos sin ubicación ({localProducts.length})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {localProducts.map((product) => (
                                    <div key={product.id} className="border dark:border-gray-700 rounded-lg p-4 flex flex-col bg-white dark:bg-gray-700">
                                        <div className="flex items-start">
                                            {product.image_url && (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-md object-cover mr-3"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {product.num_reference}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Asignar a:
                                            </label>
                                            <select
                                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                onChange={(e) => handleAssignShelf(product.id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled className="dark:bg-gray-800">Seleccionar estantería...</option>
                                                {shelves.map((shelf) => (
                                                    <option key={shelf.id} value={shelf.id} className="dark:bg-gray-700">
                                                        {shelf.code} - {shelf.location}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Todas las estanterías */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
                                <span className="mr-2">🏷️</span>
                                Todas las estanterías ({shelves.length})
                            </h3>

                            <div className="space-y-4">
                                {shelves.map((shelf) => (
                                    <div key={shelf.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{shelf.location}</h4>
                                            </div>
                                            <Link
                                                href={route('shelves.show', shelf.id)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                                            >
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}