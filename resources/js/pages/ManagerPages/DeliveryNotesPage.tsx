import React, { useEffect, useState } from 'react';
import axios from 'axios';

type DeliveryNote = {
  id: number;
  ref: string;
  user: {
    name: string;
  };
  assigned_at: string;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
};

const DeliveryNotesPage = () => {
  const [notes, setNotes] = useState<DeliveryNote[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/manager/delivery-notes?search=${search}&page=${page}`);

      setNotes(res.data.data);
      setMeta(res.data.meta);
      setError(null);
    } catch (err) {
      setError("Error al cargar los albaranes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, page]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Albaranes</h2>

      <input
        type="text"
        placeholder="Buscar por referencia o cliente"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 w-full mb-4"
      />

      {loading && <p className="mb-2">Cargando albaranes...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Ref</th>
            <th className="border p-2 text-left">Cliente</th>
            <th className="border p-2 text-left">Fecha</th>
            <th className="border p-2 text-left">Descargar</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.ref}</td>
              <td className="border p-2">{order.user.name}</td>
              <td className="border p-2">{new Date(order.assigned_at).toLocaleDateString()}</td>
              <td className="border p-2">
                <a
                  href={`/api/delivery-notes/${order.id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {Array.from({ length: meta.last_page }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                meta.current_page === i + 1
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryNotesPage;
