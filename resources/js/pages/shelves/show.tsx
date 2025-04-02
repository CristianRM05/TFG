import { Head, usePage } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { Product, Shelf, SharedData } from '@/types';

interface Props extends SharedData {
    shelf: Shelf & {
        products: Product[];
    };
}

export default function ShelfShow({ shelf }: Props) {
    const { auth } = usePage<SharedData>().props;

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
                            {/* Mostramos el código y location directamente */}
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                                {shelf.code} {/* SH-001 */}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">
                                <span className="font-medium">Ubicación:</span> {shelf.location} {/* Usamos location directamente */}
                            </p>
                            {shelf.max_capacity && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{shelf.code} - {shelf.location}</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mt-4">
                                        Capacidad: {shelf.total_stock}/{shelf.max_capacity} unidades
                                    </p>
                                </div>
                            )}
                            {/* Listado de productos */}
                            <h4 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">
                                Productos en esta estantería:
                            </h4>

                            {shelf.products?.length ? (
                                <div className="space-y-4">
                                    {shelf.products.map(product => (
                                        <div key={product.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
                                            <div className="flex items-start">
                                                {product.image_url && (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-md object-cover mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <h5 className="font-medium text-gray-900 dark:text-white">{product.name}</h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {product.num_reference}</p>
                                                    {/* Mostrar ubicación desde la relación */}
                                                    {product.shelf && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Ubicación: {product.shelf.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic">No hay productos en esta estantería</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}