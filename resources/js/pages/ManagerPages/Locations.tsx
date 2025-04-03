import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { Sheld, User } from '@/types';
import { usePage } from '@inertiajs/react';

//listar las localizaciones(estanterias) y la cantidad de producto que tienen


export default function ListProducts() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth?.user;
    const esManager = user?.role === 'Manager';
    const [shelf, setProducts] = useState<Shelf[]>([]);

    useEffect(() => {
        if (esManager) {
            fetch('/api/productos')
                .then(res => res.json())
                .then(data => {
                    // Verifica si la respuesta es paginada
                    if (data.data) {
                        setProducts(data.data);
                    } else {
                        setProducts(data); // por si no es paginada
                    }
                })
                .catch(err => console.error('Error al cargar productos:', err));
        }
    }, [esManager]);

    return (
        <AppLayout>
            <Head title="Productos en Almacén" />
            <div className="p-4 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">📦 Productos en Almacén</h1>

                {!esManager ? (
                    <p className="text-red-600">Acceso restringido. Esta sección es solo para usuarios con rol de Manager.</p>
                ) : products.length === 0 ? (
                    <p>No hay productos registrados.</p>
                ) : (
                    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-xl p-6 border">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2">Referencia</th>
                                    <th className="p-2">Categoría</th>
                                    <th className="p-2">Stock</th>
                                    <th className="p-2">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b dark:border-gray-700">
                                        <td className="p-2">{product.name}</td>
                                        <td className="p-2">{product.num_reference}</td>
                                        <td className="p-2">{product.categoria}</td>
                                        <td className="p-2">{product.stock}</td>
                                        <td className="p-2">{product.price} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
