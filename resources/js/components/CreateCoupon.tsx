import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateCouponModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expires_at: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/create-coupon', formData);
      setMessage(response.data.message);
      setError('');


      Swal.fire({
        title: '¡Cupón creado!',
        text: 'El cupón se ha creado correctamente.',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Aceptar'
      });

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el cupón.');
      setMessage('');
    }
    setFormData({
      code: '',
      discount: '',
      expires_at: '',
    });
  };


  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center transition duration-300">
<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-down">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Nuevo Cupón</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Código del Cupón</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="EJ: DESCUENTO10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descuento (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="EJ: 15"
              min="1"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Expiración</label>
            <input
              type="date"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Crear Cupón
            </button>
          </div>
        </form>

        {(message || error) && (
          <div className="mt-6 text-center">
            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        )}

        {/* Botón de cerrar en la esquina */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateCouponModal;
