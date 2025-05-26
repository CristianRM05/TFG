import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      await axios.post('/admin/send-newsletter', {
        subject,
        message,
      });

      Swal.fire('✅ Enviado', 'El newsletter se ha enviado correctamente.', 'success');
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      Swal.fire('❌ Error', 'No se pudo enviar el newsletter.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in-down">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Enviar Newsletter</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 dark:text-black"
              placeholder="Ej: ¡Nuevas ofertas disponibles!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-md p-2
               dark:text-black"
              placeholder="Escribe aquí el contenido del correo..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            disabled={sending}
          >
            Cancelar
          </button>

          <button
            onClick={handleSend}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition"
            disabled={sending || !subject || !message}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>

        {/* Cerrar arriba */}
        <button
          onClick={onClose}
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

export default NewsletterModal;
