import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

const DriverRoutes = () => {
    interface Route {
        id: number;
        status: string;
        stops_count?: number;
        estimated_delivery_date?: string;
    }

    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('assigned');

    useEffect(() => {
        setLoading(true);
        setError(null);

        router.get('/api/driver/routes', { status: statusFilter }, {
            onSuccess: (response: { props: { routes: Route[] } }) => {
                setRoutes(response.props.routes);
                setLoading(false);
            },
            onError: (err) => {
                setError('Error al cargar las rutas.');
                setLoading(false);
                console.error(err);
            },
            preserveScroll: true,
        });
    }, [statusFilter]);

    const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setStatusFilter(event.target.value);
    };

    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Lista de Rutas</h1>

            <div className="mb-3">
                <label htmlFor="statusFilter" className="form-label">Filtrar por estado:</label>
                <select
                    className="form-select"
                    id="statusFilter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                >
                    <option value="assigned">Asignadas</option>
                    <option value="in_transit">En Tránsito</option>
                    <option value="delivered">Entregadas</option>
                    <option value="failed">Fallidas</option>
                    <option value="">Todas</option>
                </select>
            </div>

            {routes.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No hay rutas disponibles para el estado seleccionado.
                </div>
            ) : (
                <ul className="list-group">
                    {routes.map((route) => (
                        <li key={route.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-1">ID: {route.id}</h6>
                                <p className="mb-1">Estado: <span className={`badge bg-${
                                    route.status === 'assigned' ? 'primary' :
                                    route.status === 'in_transit' ? 'warning' :
                                    route.status === 'delivered' ? 'success' :
                                    route.status === 'failed' ? 'danger' : 'secondary'
                                }`}>{route.status}</span></p>
                                <small>Paradas: {route.stops_count || 'N/A'}</small><br />
                                <small>Entrega estimada: {route.estimated_delivery_date || 'N/A'}</small>
                            </div>
                            <Link href={`/driver/routes/${route.id}`} className="btn btn-outline-primary btn-sm">Ver detalles</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DriverRoutes;
