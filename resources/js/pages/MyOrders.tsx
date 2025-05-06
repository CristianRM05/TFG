import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface OrderItem {
    id: number;
    product: {
        name: string;
        price: number;
    };
    quantity: number;
}

interface Order {
    id: number;
    ref: string;
    created_at: string;
    items: OrderItem[];
}

interface MyOrdersProps {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis pedidos',
        href: '/my-orders',
    },
];

const MyOrders: React.FC<MyOrdersProps> = ({ orders }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const toggleOrderDetails = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Pedidos" />
            <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-6">Mis Pedidos</h1>

            {orders.data.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-600 text-lg">No has realizado ningún pedido aún.</p>
                    <br />
                    <a href='/dashboard' className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition">
                        Explorar bebidas
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.data.map(order => (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col" key={order.id}>
                            <div className="p-4 border-b border-amber-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-gray-800 font-medium">Pedido #{order.ref}</h3>
                                        <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-amber-50 text-xs">
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-amber-100 flex-grow">
                                {order.items.slice(0, expandedOrderId === order.id ? order.items.length : 2).map(item => (
                                    <div className="flex items-center justify-between px-4 py-3" key={item.id}>
                                        <div className="flex items-center">
                                            <div className="bg-amber-50 rounded-md w-8 h-8 flex items-center justify-center mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-800 font-medium text-xs">{item.product.name}</h3>
                                                <p className="text-gray-500 text-xs">
                                                    €{item.product.price} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <span className="px-2 py-1 bg-amber-50 rounded-full text-amber-800 text-xs">
                                                €{(item.product.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {order.items.length > 2 && (
                                <button
                                    onClick={() => toggleOrderDetails(order.id)}
                                    className="w-full bg-amber-50 px-3 py-1 text-center text-xs text-amber-700 hover:bg-amber-100 transition flex items-center justify-center focus:outline-none"
                                >
                                    {expandedOrderId === order.id ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            Ocultar
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Ver {order.items.length - 2} más
                                        </>
                                    )}
                                </button>
                            )}

                            <div className="bg-amber-50 px-4 py-2 flex justify-between items-center mt-auto">
                                <span className="text-xs text-amber-700">
                                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                </span>
                                <span className="text-sm font-medium text-amber-800">
                                    Total: {order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    ))}

                </div>

            )}
            <div className="mt-6 flex justify-center gap-4 items-center">
                {orders.prev_page_url && (
                    <a
                        href={orders.prev_page_url}
                        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition"
                    >
                        Anterior
                    </a>
                )}

                <span className="text-sm text-gray-700">
                    Página {orders.current_page} de {orders.last_page}
                </span>

                {orders.next_page_url && (
                    <a
                        href={orders.next_page_url}
                        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition"
                    >
                        Siguiente
                    </a>
                )}
            </div>

        </AppLayout>
    );
};

export default MyOrders;
