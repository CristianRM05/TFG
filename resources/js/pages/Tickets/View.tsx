import { useState } from 'react'
import { router, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout';

interface Message {
  id: number;
  sender_type: string;
  message: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  token: string;
  messages?: Message[];
}

export default function TicketView({ ticket }: { ticket: Ticket }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(ticket.messages || [])
  const [status, setStatus] = useState(ticket.status)

  const isClosed = status === 'cerrado'

  const handleSend = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (message.trim() === '' || isClosed) return

    router.post(`/tickets/${ticket.id}/reply`, {
      message,
      token: ticket.token
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setMessages([
          ...messages,
          {
            id: Date.now(),
            sender_type: 'user',
            message,
          }
        ])
        setMessage('')
      }
    })
  }

  const handleCloseTicket = () => {
    router.patch(`/tickets/${ticket.id}/close`, {
      token: ticket.token
    }, {
      onSuccess: () => setStatus('cerrado')
    })
  }

  return (
    <AppLayout>
      <Head title={`Ticket #${ticket.id}`} />

        <h1 className="text-2xl font-bold mb-2">Ticket: {ticket.subject}</h1>
        <p className="mb-4 text-sm text-gray-600">
          Estado: <span className={isClosed ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
            {status}
          </span>
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-4 mb-6">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className="border rounded p-3 bg-gray-50">
              <div className="text-sm font-semibold mb-1">
                {msg.sender_type === 'admin' ? '👨‍💼 Soporte' : '👤 Tú'}
              </div>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        {!isClosed && (
          <form onSubmit={handleSend}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border rounded p-3 resize-none mb-3"
              placeholder="Escribe tu mensaje..."
              required
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCloseTicket}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Finalizar Ticket
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </form>
        )}

        {isClosed && (
          <div className="text-center text-gray-500 font-medium mt-6">
            Este ticket ya está cerrado. No puedes enviar más mensajes.
          </div>
        )}
    </AppLayout>
  )
}
