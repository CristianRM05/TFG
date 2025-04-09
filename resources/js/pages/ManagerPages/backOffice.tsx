import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BackOffice = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await axios.get('/backoffice/orders');
    setOrders(data.orders ?? []); // Asegura que haya un array
  };

  const fetchOrderDetails = async (orderId: number) => {
    const { data } = await axios.get(`/backoffice/orders/${orderId}`);
    setSelectedOrder(data.order);
    setTrucks(data.trucks);
    setDrivers(data.drivers);
  };

  const assignOrder = async (orderId: number, payload: unknown) => {
    await axios.post(`/backoffice/orders/${orderId}/assign`, payload);
    fetchOrders();
    setSelectedOrder(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos Pendientes</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500 italic">🛌 No hay pedidos pendientes por el momento.</div>
      ) : (
        <ul>
          {orders.map((order: any) => (
            <li key={order.id} className="mb-2">
              Pedido #{order.id} - Estado: {order.status}
              <button className="ml-4 btn btn-blue" onClick={() => fetchOrderDetails(order.id)}>
                Asignar
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className="mt-6 border p-4 rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Asignar Pedido #{selectedOrder.id}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const payload = {
              scheduled_date: form.scheduled_date.value,
              truck_id: form.truck_id.value,
              driver_id: form.driver_id.value,
              departure_time: form.departure_time.value,
            };
            assignOrder(selectedOrder.id, payload);
          }}>
            <input type="date" name="scheduled_date" required className="block mb-2" />
            <input type="time" name="departure_time" required className="block mb-2" />
            <select name="truck_id" required className="block mb-2">
              {trucks.map((truck: any) => (
                <option value={truck.id} key={truck.id}>{truck.plate}</option>
              ))}
            </select>
            <select name="driver_id" required className="block mb-4">
              {drivers.map((driver: any) => (
                <option value={driver.id} key={driver.id}>{driver.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-green">Asignar Pedido</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BackOffice;
