import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';


const BackOffice = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/backoffice/orders');
      setOrders(Array.isArray(data) ? data : data.orders ?? []);
    } catch (err) {
      setError('No se pudieron cargar los pedidos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const { data } = await axios.get(`/backoffice/orders/${orderId}`);
      setSelectedOrder(data.order);
      setTrucks(data.trucks);
      setDrivers(data.drivers);
    } catch (err) {
      console.error('Error cargando el detalle del pedido', err);
    }
  };

  const assignOrder = async (orderId: number, payload: unknown) => {
    try {
      await axios.post(`/backoffice/orders/${orderId}/assign`, payload);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error al asignar el pedido', err);
    }
  };

  return (
    <AppLayout>
      <Head title="Pedidos Pendientes" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📦 Pedidos Pendientes</h1>

        {loading ? (
          <p className="text-gray-600">Cargando pedidos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 italic">🛌 No hay pedidos pendientes por el momento.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <span>
                  Pedido #{order.id} - Estado: <strong>{order.status}</strong>
                </span>
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => fetchOrderDetails(order.id)}
                >
                  Asignar
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedOrder && (
          <div className="mt-8 border p-6 rounded bg-gray-50 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Asignar Pedido #{selectedOrder.id}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const payload = {
                  scheduled_date: form.scheduled_date.value,
                  truck_id: form.truck_id.value,
                  driver_id: form.driver_id.value,
                  departure_time: form.departure_time.value,
                };
                assignOrder(selectedOrder.id, payload);
              }}
            >
              <div className="mb-2">
                <label>Fecha programada:</label>
                <input type="date" name="scheduled_date" required className="block w-full p-2 border rounded" />
              </div>
              <div className="mb-2">
                <label>Hora de salida:</label>
                <input type="time" name="departure_time" required className="block w-full p-2 border rounded" />
              </div>
              <div className="mb-2">
                <label>Camión:</label>
                <select name="truck_id" required className="block w-full p-2 border rounded">
                  {trucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.plate}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label>Conductor:</label>
                <select name="driver_id" required className="block w-full p-2 border rounded">
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                ✅ Asignar Pedido
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BackOffice;
