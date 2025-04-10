import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { Product, Shelf, SharedData } from '@/types';
import { useState } from 'react';

interface Props extends SharedData {
    shelf: Shelf & {
        products: Product[];
    };
}

export default function ShelfShow({ shelf }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [products, setProducts] = useState(
        shelf.products?.filter(product => product.stock > 0) || []
    );

    const handleRemoveFromShelf = async (productId: number) => {
        if (!confirm('¿Seguro que quieres quitar este producto de la estantería?')) {
            return;
        }

        try {
            await router.delete(route('products.remove-merge', { product: productId }), {
                preserveScroll: true
            });

            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            alert('Error al desasignar el producto');
            console.error('Error detallado:', error);
        }
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
                            <h3 className="text-lg font-bold mb-2">{shelf.code}</h3>
                            <p className="mb-4">Ubicación: {shelf.location}</p>
                            
                            {shelf.max_capacity && (
                                <p className="mb-4">
                                    Capacidad: {products.reduce((total, p) => total + p.stock, 0)}/{shelf.max_capacity} unidades
                                </p>
                            )}

                            <h4 className="text-md font-semibold mb-3">
                                Productos en esta estantería:
                            </h4>

                            {products.length ? (
                                <div className="space-y-4">
                                    {products.map(product => (
                                        <div key={product.id} className="border dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start">
                                                    {product.image_url && (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="h-12 w-12 rounded-md object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <h5>{product.name}</h5>
                                                        <p>Ref: {product.num_reference}</p>
                                                        <p>Stock: {product.stock}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromShelf(product.id)}
                                                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm"
                                                >
                                                    Quitar de estantería
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No hay productos con stock disponible en esta estantería</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}