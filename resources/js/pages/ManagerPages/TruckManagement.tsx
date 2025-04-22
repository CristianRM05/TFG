import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function TruckManagement({ trucks }: { trucks: any[] }) {
  const [form, setForm] = useState({ license_plate: '', max_capacity: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'license_plate' ? value.toUpperCase() : value;
    setForm({ ...form, [name]: updatedValue });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const licensePlateRegex = /^\d{4}[A-Z]{3}$/i;
    if (!licensePlateRegex.test(form.license_plate)) {
      setError('La matrícula debe tener 4 números seguidos de 3 letras (ej: 1234ABC).');
      setSuccess(null);
      return;
    }

    const maxCapacityNumber = parseFloat(form.max_capacity);
    if (isNaN(maxCapacityNumber) || maxCapacityNumber <= 0) {
      setError('La capacidad máxima debe ser un número positivo.');
      setSuccess(null);
      return;
    }

    const duplicate = trucks.find(
      (truck) => truck.license_plate === form.license_plate && truck.id !== editId
    );
    if (duplicate) {
      setError('Ya existe un vehículo con esta matrícula.');
      setSuccess(null);
      return;
    }

    const payload = {
      license_plate: form.license_plate,
      max_capacity: form.max_capacity,
      status: 'Disponible',
    };
    editId
      ? router.put(`/trucks/${editId}`, payload)
      : router.post('/trucks', payload);
    setForm({ license_plate: '', max_capacity: '' });
    setEditId(null);
    setShowModal(false);
    setError(null);
    setSuccess(editId ? 'Vehículo actualizado correctamente.' : 'Vehículo registrado exitosamente.');
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      router.delete(`/trucks/${id}`);
    }
  };

  const handleEdit = (truck: any) => {
    setForm({
      license_plate: truck.license_plate,
      max_capacity: truck.max_capacity,
    });
    setEditId(truck.id);
    setShowModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleStatusChange = (id: number, status: string) => {
    router.put(`/trucks/${id}/status`, { status });
  };

  return (
    <AppLayout>
      <Head title="Gestión de Vehículos" />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🚚 Gestión de Vehículos</h1>

        {success && <div className="bg-green-100 text-green-800 p-3 rounded border border-green-400">{success}</div>}

        <button
          onClick={() => {
            setForm({ license_plate: '', max_capacity: '' });
            setEditId(null);
            setShowModal(true);
            setError(null);
            setSuccess(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Dar de alta nuevo vehículo
        </button>

        {/* Modal de Alta/Edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                {editId ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label>Matricula:</label>
                  <input
                    type="text"
                    name="license_plate"
                    value={form.license_plate}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                  />
                </div>
                <div>
                  <label>Capacidad máxima (kg):</label>
                  <input
                    type="number"
                    name="max_capacity"
                    value={form.max_capacity}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                    min="1"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                      setForm({ license_plate: '', max_capacity: '' });
                      setError(null);
                      setSuccess(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    {editId ? 'Actualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de camiones */}
        <table className="w-full text-left border mt-8">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Matrícula</th>
              <th className="p-2">Capacidad</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, index) => (
              <tr key={truck.id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{truck.license_plate}</td>
                <td className="p-2">{truck.max_capacity} kg</td>
                <td className="p-2">{truck.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(truck)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(truck.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                  {truck.status === 'Mantenimiento' ? (
                    <button
                      onClick={() => handleStatusChange(truck.id, 'Disponible')}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Disponible
                    </button>
                  ) : (
                    truck.status !== 'Ocupado' && (
                      <button
                        onClick={() => handleStatusChange(truck.id, 'Mantenimiento')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Mantenimiento
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
