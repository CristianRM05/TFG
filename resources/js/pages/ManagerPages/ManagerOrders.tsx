import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, Truck, MapPin, Clock, AlertCircle, CheckCircle, Filter, Moon, Sun } from 'lucide-react';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';
import axios from 'axios';

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
    const { orders: initialOrders } = usePage<{ orders: Order[] }>().props;
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [hoveredOrder, setHoveredOrder] = useState<number | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

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
        Swal.fire({
            title: '¿Asignar pedido?',
            text: 'Este pedido pasará a estado "En proceso".',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, asignar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#E17100',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`/manager/orders/${orderId}/assign`)
                    .then(response => {
                        const updatedOrders = orders.map(order => {
                            if (order.id === orderId) {
                                return { ...order, status: 'In progress' };
                            }
                            return order;
                        });
                        setOrders(updatedOrders);
                        Swal.fire({
                            title: 'Asignado',
                            text: 'El pedido ha sido marcado como "En proceso".',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    })
                    .catch(error => {
                        Swal.fire('Error', 'No se pudo asignar el pedido.', 'error');
                        console.error('Error al asignar pedido:', error);
                    });
            }
        });
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
            <div className="p-6 max-w-6xl mx-auto transition-colors duration-200" >
                <div className="flex flex-col justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Package className="w-8 h-8 mr-2" style={{ color: '#E17100' }} />
                        Gestión de Pedidos
                    </h1>
                    <br />
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-3">
                            <div className="bg-white p-3 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium">{pendingOrders.length} Pagados</span>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#E17100' }}></div>
                                <span className="text-sm font-medium">{processingOrders.length} En proceso</span>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-md flex items-center hover:shadow-lg transition-shadow duration-200">
                                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium">{completedOrders.length} Completados</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros con más espaciado */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4" style={{ borderLeftColor: '#E17100' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 mr-3" style={{ color: '#E17100' }} />
                            <span className="font-medium text-gray-700 text-lg">Filtrar por estado:</span>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-transform duration-200 shadow-sm ${filterStatus === 'all'
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                style={{ backgroundColor: filterStatus === 'all' ? '#E17100' : '' }}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilterStatus('paid')}
                                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-transform duration-200 shadow-sm ${filterStatus === 'paid'
                                    ? 'bg-yellow-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pagados
                            </button>
                            <button
                                onClick={() => setFilterStatus('In progress')}
                                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-transform duration-200 shadow-sm ${filterStatus === 'In progress'
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                style={{ backgroundColor: filterStatus === 'In progress' ? '#E17100' : '' }}
                            >
                                En proceso
                            </button>
                            <button
                                onClick={() => setFilterStatus('Completed')}
                                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-transform duration-200 shadow-sm ${filterStatus === 'Completed'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Completados
                            </button>
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">
                            {orders.length === 0
                                ? "No hay pedidos registrados por el momento."
                                : "No hay pedidos que coincidan con el filtro seleccionado."}
                        </p>
                        <p className="text-gray-400 mt-2">
                            {orders.length === 0
                                ? "Los nuevos pedidos aparecerán aquí automáticamente."
                                : "Intenta cambiar el filtro para ver otros pedidos."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: '#F3F3DF' }}>
                            <h2 className="text-xl font-semibold text-gray-800">Lista de Pedidos</h2>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <li
                                    key={order.id}
                                    className={`p-5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${hoveredOrder === order.id ? 'bg-gray-50' : ''
                                        }`}
                                    onMouseEnter={() => setHoveredOrder(order.id)}
                                    onMouseLeave={() => setHoveredOrder(null)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: '#F3F3DF' }}>
                                                <Package className="w-6 h-6" style={{ color: '#E17100' }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="font-semibold text-gray-900">Pedido #{order.ref}</span>
                                                    <div className="ml-3">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                                                    <span>{order.shipping_address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 self-end md:self-auto">
                                            {!['Completed', 'In progress'].includes(order.status) && (
                                                <button
                                                    className="px-4 py-2 text-white rounded-md transition-all duration-200 flex items-center cursor-pointer transform hover:scale-105 shadow-md hover:shadow-lg"
                                                    style={{ backgroundColor: '#E17100' }}
                                                    onClick={() => handleAssign(order.id)}
                                                >
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    Asignar
                                                </button>
                                            )}
                                            <button
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
                                                onClick={() => toggleDetails(order.id)}
                                            >
                                                {expandedOrderId === order.id ? 'Ocultar' : 'Detalles'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedOrderId === order.id && (
                                        <div className="mt-4 w-full p-4 rounded shadow-inner transition-shadow duration-200" style={{ backgroundColor: '#F3F3DF' }}>
                                            <h3 className="text-md font-semibold mb-3 text-gray-800">Productos en el pedido:</h3>
                                            {order.items.length === 0 ? (
                                                <p className="text-gray-500 italic">No hay productos registrados en este pedido.</p>
                                            ) : (
                                                <div>
                                                    <ul className="space-y-2 text-sm">
                                                        {order.items.map((item) => (
                                                            <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded hover:bg-gray-100 transition-colors duration-200 shadow-sm">
                                                                <span className="font-medium text-gray-800">{item.product.name}</span>
                                                                <span className="text-gray-600">
                                                                    {item.quantity} x {Number(item.price).toFixed(2)} € ={" "}
                                                                    <strong className="text-gray-900">{(Number(item.price) * item.quantity).toFixed(2)} €</strong>
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {/* Boton para descargar albaran */}

                                                    <div className="mt-5 pt-3 border-t border-gray-200 flex justify-between items-center">
                                                        {/* Enlace de descarga alineado a la izquierda */}
                                                        <a
                                                            href={`/manager/orders/${order.id}/invoice`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                                                        >
                                                            Descargar albarán
                                                        </a>

                                                        {/* Total del pedido alineado a la derecha */}
                                                        <div className="text-right">
                                                            <span className="text-gray-600">Total del pedido: </span>
                                                            <span className="font-bold text-gray-900 text-lg ml-2" style={{ color: '#E17100' }}>
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
        </AppLayout >
    );
}
