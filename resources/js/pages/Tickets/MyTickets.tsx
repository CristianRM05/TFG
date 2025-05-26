import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import CreateTicketModal from './CreateTicket' // Asegúrate de que esta ruta sea correcta

interface Ticket {
  id: number
  subject: string
  status: string
  // Agrega aquí otros campos si los hay
}

interface MyTicketsProps {
  tickets: Ticket[]
  auth: {
    user: any // Puedes reemplazar 'any' por el tipo correcto de usuario si lo tienes
  }
}

export default function MyTickets({ tickets, auth }: MyTicketsProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <AppLayout>
      <Head title="Mis Tickets" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mis Tickets</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            📝 Crear Ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <p className="text-gray-600">No has creado ningún ticket aún.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <p className="text-lg  text-white dark:text-black font-semibold">{ticket.subject}</p>
                  <p className="text-sm text-white dark:text-black">
                    Estado:{' '}
                    <span className={ticket.status === 'cerrado' ? 'text-red-600' : 'text-green-600'}>
                      {ticket.status}
                    </span>
                  </p>
                </div>
                <Link
                  href={route('tickets.show', ticket.id)}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        )}

      <CreateTicketModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={auth?.user}
      />
    </AppLayout>
  )
}
