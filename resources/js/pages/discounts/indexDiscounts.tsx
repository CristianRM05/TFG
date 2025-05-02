import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '../../layouts/app-layout';
import { Product, Shelf, SharedData } from '@/types';
import { useState, useEffect } from 'react';

interface DiscountsPageProps extends SharedData {
    products?: Product[]; // Hacer opcional
    productsWithoutDiscount?: Product[]; // Hacer opcional
    flash?: {
        success?: string;
        error?: string;
    };
}
export default function DiscountsIndex() {
    const {
        products = [],
        productsWithoutDiscount = [],
        flash,
        auth
    } = usePage<DiscountsPageProps>().props;

    // Estados iniciales seguros
    const [discounts, setDiscounts] = useState<Product[]>(products);
    const [availableProducts, setAvailableProducts] = useState<Product[]>(productsWithoutDiscount);
    const [formData, setFormData] = useState({
        product_id: '',
        discount_percent: ''
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Update state when props change
    useEffect(() => {
        setDiscounts(products);
        setAvailableProducts(productsWithoutDiscount);
    }, [products, productsWithoutDiscount]);

    // Show success message when flash changes
    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await router.post(route('discounts.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSuccess(true);
                    setFormData({ product_id: '', discount_percent: '' });
                }
            });
        } catch (error) {
            console.error('Error applying discount:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: number) => {
        if (!confirm('¿Estás seguro de eliminar este descuento?')) return;

        try {
            await router.delete(`/manager/discounts/${productId}`, {
                preserveScroll: true,
                onSuccess: () => setShowSuccess(true)
            });
        } catch (error) {
            console.error('Error deleting discount:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Descuentos</h2>}
        >
            <Head title="Gestión de Descuentos" />

            {showSuccess && (
                <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg mt-4">
                        {flash?.success || 'Operación realizada con éxito'}
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        {/* Formulario para añadir descuento */}
                        <div className="mb-8 p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Añadir Nuevo Descuento</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Producto
                                        </label>
                                        <select
                                            name="product_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
                                            value={formData.product_id}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar producto</option>
                                            {availableProducts?.map(product => ( // Usa optional chaining
                                                <option key={product.id} value={product.id}>
                                                    {product.name} (${product.price?.toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Porcentaje de Descuento (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount_percent"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
                                            value={formData.discount_percent}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? 'Aplicando...' : 'Aplicar Descuento'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Lista de descuentos activos */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Descuentos Activos</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Producto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Precio Original</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Descuento</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Precio Final</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {discounts?.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">${product.price?.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{product.discount_percent}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-bold text-green-600 dark:text-green-400">
                                                        ${(product.price ?? 0 * (1 - (product.discount_percent || 0) / 100)).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {discounts?.length === 0 && ( // Mensaje cuando no hay datos
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    No hay productos con descuento
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}