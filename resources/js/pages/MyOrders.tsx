import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app/app-header-layout';
import type { BreadcrumbItem } from '@/types';

interface OrderItem {
    id: number;
    product: { name: string; price: number };
    quantity: number;
}

interface Order {
    id: number;
    ref: string;
    created_at: string;
    status: 'paid' | 'In progress' | 'Completed';
    items: OrderItem[];
}

interface MyOrdersProps extends Record<string, unknown> {
    auth: { user: { name: string; email: string } };
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

export default function MyOrders() {
    const { auth, orders } = usePage<MyOrdersProps>().props;
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<Order['status'][]>(['paid', 'In progress', 'Completed']);

    const toggle = (id: number) => setExpandedOrderId(prev => (prev === id ? null : id));

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Mis pedidos', href: route('orders.manager') },
    ];

    // Status configuration
    const statusConfig = {
        'paid': {
            label: 'Pagado',
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            darkColor: 'bg-blue-900 text-white border-blue-800'
        },
        'In progress': {
            label: 'En Progreso',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            darkColor: 'bg-yellow-900 text-white  border-yellow-800'
        },
        'Completed': {
            label: 'Completado',
            color: 'bg-green-100 text-green-800 border-green-200',
            darkColor: 'bg-green-900 text-white  border-green-800'
        }
    };

    // Toggle status selection
    const toggleStatusFilter = (status: Order['status']) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    // Filter orders based on selected statuses
    const filteredOrders = orders.data.filter(order =>
        selectedStatuses.includes(order.status)
    );

    return (
        <AppLayout
            user={auth.user}
            breadcrumbs={breadcrumbs}
            header="Mis Pedidos"
        >
            <Head title="Mis Pedidos" />
            <div className="min-h-screen px-6">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mis Pedidos</h1>
                    </div>

                    {/* Status Filter Badges */}
                    <div className="flex space-x-2 mb-4">
                        {Object.entries(statusConfig).map(([status, config]) => {
    const isSelected = selectedStatuses.includes(status as Order['status']);
    let finalClass = 'px-3 py-1 rounded-full border-2 text-sm font-medium transition-all';

    if (status === 'paid') {
        finalClass += isSelected
            ? ' bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-white dark:border-blue-800'
            : ' bg-gray-100 text-gray-500 border-transparent opacity-50 dark:bg-gray-800 dark:text-white';
    } else if (status === 'In progress') {
        finalClass += isSelected
            ? ' bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-white dark:border-yellow-800'
            : ' bg-gray-100 text-gray-500 border-transparent opacity-50 dark:bg-gray-800 dark:text-white';
    } else if (status === 'Completed') {
        finalClass += isSelected
            ? ' bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-white dark:border-green-800'
            : ' bg-gray-100 text-gray-500 border-transparent opacity-50 dark:bg-gray-800 dark:text-white';
    }

    return (
        <button
            key={status}
            onClick={() => toggleStatusFilter(status as Order['status'])}
            className={finalClass}
        >
            {config.label}
        </button>
    );
})}


                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4z M3 17l9 4 9-4-9-4-9 4z" />
                        </svg>
                        <p className="text-lg text-gray-600 dark:text-white mb-4">
                            No hay pedidos en los estados seleccionados.
                        </p>
                        <Link
                            href={route('dashboard')}
                            className="inline-block bg-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-amber-500 transition"
                        >Explorar catálogo</Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filteredOrders.map(order => {
                            const total = order.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toFixed(2);
                            const status = order.status;
                            const statusInfo = statusConfig[status];

                            return (
                                <li key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => toggle(order.id)}
                                        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                                    >
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-lg font-semibold text-gray-800 dark:text-white">Pedido #{order.ref}</p>
                                                <span
                                                    className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${statusInfo.color}
                            dark:${statusInfo.darkColor}
                          `}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-lg font-bold text-amber-500">€{total}</p>
                                    </button>
                                    <a
                                        href={route('orders.invoice.download', order.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-amber-600 hover:underline text-sm ml-4"
                                    >
                                        Descargar Factura
                                    </a>


                                    {expandedOrderId === order.id && (
                                        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex justify-between py-2">
                                                    <div>
                                                        <p className="text-gray-800 dark:text-white font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-300">x{item.quantity} × €{item.product.price.toFixed(2)}</p>
                                                    </div>
                                                    <p className="text-gray-800 dark:text-white font-semibold">€{(item.product.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
                {
                    orders.last_page > 1 && (
                        <div className="mt-8 flex justify-center space-x-4">
                            {orders.prev_page_url && (
                                <Link
                                    href={orders.prev_page_url}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition"
                                >
                                    Anterior
                                </Link>
                            )}
                            <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-gray-800 dark:text-white">
                                Página {orders.current_page} de {orders.last_page}
                            </span>
                            {orders.next_page_url && (
                                <Link
                                    href={orders.next_page_url}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition"
                                >
                                    Siguiente
                                </Link>
                            )}
                        </div>
                    )}

            </div>
        </AppLayout>
    );
}
