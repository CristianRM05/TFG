import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AvailableCouponsModalProps {
  show: boolean;
  handleClose: () => void;
}

const AvailableCouponsModal: React.FC<AvailableCouponsModalProps> = ({ show, handleClose }) => {
  const [coupons, setCoupons] = useState<{
    id: number;
    code: string;
    discount: number;
    status: string;
    expires_at: string | null;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      setLoading(true);
      axios
        .get('/coupons/available')
        .then((res) => {
          setCoupons(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative animate-fade-in-down">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Cupones Disponibles</h2>

        {loading ? (
          <div className="text-center py-6">Cargando cupones...</div>
        ) : coupons.length === 0 ? (
          <p className="text-center text-gray-600">No tienes cupones disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-indigo-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 border-b">Código</th>
                  <th className="px-4 py-2 border-b">Descuento</th>
                  <th className="px-4 py-2 border-b">Caduca</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="text-sm text-gray-800 text-center hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">{coupon.code}</td>
                    <td className="px-4 py-2 border-b">{coupon.discount}%</td>
                    <td className="px-4 py-2 border-b">
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString()
                        : 'Sin caducidad'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>

        {/* Botón de cerrar arriba */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AvailableCouponsModal;
