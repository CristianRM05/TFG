import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, Truck, MapPin, Clock, AlertCircle, CheckCircle, Filter, Moon, Sun } from 'lucide-react';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
    };
}

interface Order {
    id: number;
    ref: string;
    shipping_address: string;
    status: string;
    items: OrderItem[];
}

interface PageProps {
    orders: Order[];
}

export default function ManagerOrdersPage() {
    const { orders } = usePage<{ orders: Order[] }>().props;
    const [hoveredOrder, setHoveredOrder] = useState<number | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Verificar preferencia de tema del sistema al cargar
    useEffect(() => {
        const savedTheme = localStorage.getItem('appearance');
        if (savedTheme) {
        } else {
            // Si no hay preferencia, verificar preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }, []);



    // Filtrar pedidos por estado
    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const pendingOrders = orders.filter(order => order.status === 'paid');
    const processingOrders = orders.filter(order => order.status === 'In progress');
    const completedOrders = orders.filter(order => order.status === 'Completed');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pagado
                    </span>
                );
            case 'In progress':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Truck className="w-3 h-3 mr-1" />
                        En proceso
                    </span>
                );
            case 'Completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {status}
                    </span>
                );
        }
    };

    const handleAssign = (orderId: number) => {
        console.log('Asignar pedido', orderId);
    };

    const toggleDetails = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };



    const getTotalOrderAmount = (items: OrderItem[]) => {
        return items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0).toFixed(2);
    };

    return (
        <AppLayout>
            <Head title="Gestión de Pedidos" />
            <div className="p-6 max-w-6xl mx-auto transition-colors duration-200 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                        <Package className="w-8 h-8 mr-2 text-blue-600 dark:text-blue-400" />
                        Gestión de Pedidos
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow flex items-center">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium dark:text-gray-200">{pendingOrders.length} Pagados</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow flex items-center">
                                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium dark:text-gray-200">{processingOrders.length} En proceso</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow flex items-center">
                                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium dark:text-gray-200">{completedOrders.length} Completados</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Filtro por estado */}
                <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Filtrar por estado:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filterStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilterStatus('paid')}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filterStatus === 'paid'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Pagados
                            </button>
                            <button
                                onClick={() => setFilterStatus('In progress')}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filterStatus === 'In progress'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                En proceso
                            </button>
                            <button
                                onClick={() => setFilterStatus('Completed')}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filterStatus === 'Completed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                Completados
                            </button>
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                        <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {orders.length === 0
                                ? "No hay pedidos registrados por el momento."
                                : "No hay pedidos que coincidan con el filtro seleccionado."}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 mt-2">
                            {orders.length === 0
                                ? "Los nuevos pedidos aparecerán aquí automáticamente."
                                : "Intenta cambiar el filtro para ver otros pedidos."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Lista de Pedidos</h2>
                        </div>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className={`p-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                        hoveredOrder === order.id ? 'bg-blue-50 dark:bg-gray-700' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredOrder(order.id)}
                                    onMouseLeave={() => setHoveredOrder(null)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                                                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-gray-900 dark:text-white">Pedido #{order.ref}</span>
                                                    <div className="ml-3">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                                                    <span>{order.shipping_address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 self-end md:self-auto">
                                            {!['Completed', 'In progress'].includes(order.status) && (
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center"
                                                    onClick={() => handleAssign(order.id)}
                                                >
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    Asignar
                                                </button>
                                            )}
                                            <button
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                                onClick={() => toggleDetails(order.id)}
                                            >
                                                {expandedOrderId === order.id ? 'Ocultar' : 'Detalles'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedOrderId === order.id && (
                                        <div className="mt-4 w-full bg-gray-50 dark:bg-gray-700 p-4 rounded">
                                            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">Productos en el pedido:</h3>
                                            {order.items.length === 0 ? (
                                                <p className="text-gray-500 dark:text-gray-400 italic">No hay productos registrados en este pedido.</p>
                                            ) : (
                                                <div>
                                                    <ul className="space-y-2 text-sm">
                                                        {order.items.map((item) => (
                                                            <li key={item.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded">
                                                                <span className="font-medium text-gray-800 dark:text-gray-200">{item.product.name}</span>
                                                                <span className="text-gray-600 dark:text-gray-400">
                                                                    {item.quantity} x {Number(item.price).toFixed(2)} € ={" "}
                                                                    <strong className="text-gray-900 dark:text-white">{(Number(item.price) * item.quantity).toFixed(2)} €</strong>
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                                                        <div className="text-right">
                                                            <span className="text-gray-600 dark:text-gray-400">Total del pedido: </span>
                                                            <span className="font-bold text-gray-900 dark:text-white text-lg ml-2">
                                                                {getTotalOrderAmount(order.items)} €
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
