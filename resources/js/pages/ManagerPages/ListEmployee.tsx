import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function ListEmployee() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/employees')
      .then(response => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener empleados:', error);
        setLoading(false);
      });
  }, []);

  const operarios = employees.filter(e => e.role === 'Operario');
  const repartidores = employees.filter(e => e.role === 'Repartidor');

  return (
    <AppLayout>
      <Head title="Gestión de Personal" />
      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">👥 Gestión de Personal</h1>

        {loading ? (
          <p className="text-gray-600">Cargando empleados...</p>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-2">Operarios</h2>
              {operarios.length === 0 ? (
                <p className="text-gray-500 italic">No hay operarios registrados.</p>
              ) : (
                <table className="w-full border text-left">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-2">Foto</th>
                      <th className="p-2">Nº Empleado</th>
                      <th className="p-2">Nombre</th>
                      <th className="p-2">Correo</th>
                      <th className="p-2">Teléfono</th>
                      <th className="p-2">Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operarios.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="p-2">
                          {user.photograph ? (
                            <img src={`/storage/${user.photograph}`} alt="Foto" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="italic text-gray-400">Sin foto</span>
                          )}
                        </td>
                        <td className="p-2">{user.number_employ}</td>
                        <td className="p-2">{user.name} {user.last_name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.phone}</td>
                        <td className="p-2">{user.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Repartidores</h2>
              {repartidores.length === 0 ? (
                <p className="text-gray-500 italic">No hay repartidores registrados.</p>
              ) : (
                <table className="w-full border text-left">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-2">Foto</th>
                      <th className="p-2">Nº Empleado</th>
                      <th className="p-2">Nombre</th>
                      <th className="p-2">Correo</th>
                      <th className="p-2">Teléfono</th>
                      <th className="p-2">Dirección</th>
                      <th className="p-2">Carnet</th>
                      <th className="p-2">Tipo de licencia</th>
                      <th className="p-2">Expira</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repartidores.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="p-2">
                          {user.photograph ? (
                            <img src={`/storage/${user.photograph}`} alt="Foto" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="italic text-gray-400">Sin foto</span>
                          )}
                        </td>
                        <td className="p-2">{user.number_employ}</td>
                        <td className="p-2">{user.name} {user.last_name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.phone}</td>
                        <td className="p-2">{user.address}</td>
                        <td className="p-2">{user.license}</td>
                        <td className="p-2">{user.driver_license}</td>
                        <td className="p-2">{new Date(user.license_expiration_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
