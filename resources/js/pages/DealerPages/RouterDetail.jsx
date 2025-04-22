import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const RouteDetail = () => {
    const { route } = usePage().props;

    if (!route) {
        return <div>Cargando detalles de la ruta...</div>;
    }

    return (
        <div className="route-detail-container">
            <div className="header">
                <h1>Detalle de la Ruta {route.id}</h1>
                <Link href="/driver/routes" className="back-button">Volver a la lista</Link>
            </div>
            <div className="details">
                <p><strong>Descripción:</strong> {route.description || 'N/A'}</p>
                <p><strong>Punto de inicio:</strong> {route.start_point || 'N/A'}</p>
                <p><strong>Punto final:</strong> {route.end_point || 'N/A'}</p>
                <p><strong>Distancia estimada:</strong> {route.estimated_distance ? `${route.estimated_distance} km` : 'N/A'}</p>
                <p><strong>Tiempo de viaje estimado:</strong> {route.estimated_travel_time ? `${route.estimated_travel_time} minutos` : 'N/A'}</p>

                {route.stops && route.stops.length > 0 && (
                    <div className="stops-section">
                        <h2>Paradas</h2>
                        <ul className="stops-list">
                            {route.stops.map((stop) => (
                                <li key={stop.id} className="stop-item">
                                    <strong>ID:</strong> {stop.id},
                                    <strong>Dirección:</strong> {stop.address || 'N/A'},
                                    {/* Agrega aquí más detalles de la parada si los tienes */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {route.orders && route.orders.length > 0 && (
                    <div className="orders-section">
                        <h2>Pedidos</h2>
                        <ul className="orders-list">
                            {route.orders.map((order) => (
                                <li key={order.id} className="order-item">
                                    <strong>ID:</strong> {order.id},
                                    <strong>Número de pedido:</strong> {order.order_number || 'N/A'},
                                    {/* Agrega aquí más detalles del pedido si los tienes */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!route.stops || route.stops.length === 0 && (!route.orders || route.orders.length === 0) && (
                    <p>No hay detalles adicionales disponibles para esta ruta.</p>
                )}
            </div>
            {/* Aquí podrías agregar más funcionalidades como botones para actualizar el estado, etc. */}
        </div>
    );
};

export default RouteDetail;
