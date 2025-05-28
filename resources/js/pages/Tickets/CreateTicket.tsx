import { useForm } from '@inertiajs/react'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  user?: any
}

export default function CreateTicketModal({ isOpen, onClose, user }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    subject: '',
    message: ''
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post('/tickets', {
      onSuccess: () => {
        reset()
        onClose()
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0  bg-opacity-40 backdrop-blur-sm bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg z-10">
        <div className="flex items-center justify-between p-4 border-b bg-orange-600 rounded-t-lg">
          <h2 className="text-white font-semibold text-lg">Crear nuevo ticket</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 bg-[#F3F3DF]">
          {!user && (
            <div>
              <input
                type="email"
                placeholder="Tu email"
                className={`w-full p-3 text-black dark:text-black rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Asunto"
              className={`w-full p-3 rounded text-black dark:text-black border ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
              value={data.subject}
              onChange={(e) => setData('subject', e.target.value)}
              required
            />
            {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <textarea
              placeholder="Mensaje"
              rows={5}
              className={`w-full p-3 text-black dark:text-black rounded border ${errors.message ? 'border-red-500' : 'border-gray-300'} resize-none`}
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              required
            />
            {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              disabled={processing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              disabled={processing}
            >
              {processing ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
