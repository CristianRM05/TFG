import { useState, useRef, useEffect } from 'react'
import { router, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Send, X, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'

interface Message {
  id: number
  sender_type: string
  message: string
  created_at?: string
}

interface Ticket {
  id: number
  subject: string
  status: string
  token: string
  priority?: 'baja' | 'media' | 'alta'
  created_at: string
  messages?: Message[]
}

export default function TicketView({ ticket }: { ticket: Ticket }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(ticket.messages || [])
  const [status, setStatus] = useState(ticket.status)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isClosed = status === 'cerrado'

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() === '' || isClosed || isSubmitting) return

    setIsSubmitting(true)

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
            created_at: new Date().toISOString()
          }
        ])
        setMessage('')
        setIsSubmitting(false)
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  const handleCloseTicket = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez cerrado el ticket, no podrás enviar más mensajes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar ticket',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(`/tickets/${ticket.id}/close`, {
          token: ticket.token
        }, {
          onSuccess: () => {
            setStatus('cerrado')
            Swal.fire(
              '¡Ticket cerrado!',
              'El ticket ha sido cerrado exitosamente.',
              'success'
            )
          }
        })
      }
    })
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600'
      case 'media': return 'text-orange-500'
      case 'baja': return 'text-green-600'
      default: return 'text-blue-600'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
  }

  return (
    <AppLayout>
      <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />

      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">#{ticket.id}: {ticket.subject}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <span className="flex items-center gap-1">
                  Estado:
                  <span className={`font-medium ${isClosed ? 'text-red-600' : 'text-green-600'}`}>
                    {status}
                  </span>
                </span>

                {ticket.priority && (
                  <span className="flex items-center gap-1">
                    Prioridad:
                    <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </span>
                )}

                <span className="text-gray-500">
                  Creado {formatDate(ticket.created_at)}
                </span>
              </div>
            </div>

            {!isClosed && (
              <button
                type="button"
                onClick={handleCloseTicket}
                className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors"
              >
                Finalizar ticket
              </button>
            )}
          </div>
        </div>

        <div className="p-4 h-96 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <AlertTriangle className="mb-2" size={24} />
              <p>No hay mensajes en este ticket</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isAdmin = msg.sender_type === 'admin'

                return (
                  <div key={msg.id || index} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-3/4 ${isAdmin ? 'bg-white' : 'bg-blue-50'} rounded-lg p-3 shadow-sm`}>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="font-medium">
                          {isAdmin ? '👨‍💼 Soporte' : '👤 Tú'}
                        </span>
                        {msg.created_at && (
                          <span className="text-gray-500">
                            {formatDate(msg.created_at)}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-800 whitespace-pre-wrap break-words">{msg.message}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {isClosed ? (
          <div className="bg-red-50 p-4 text-center border-t">
            <p className="text-red-600 font-medium flex items-center justify-center gap-2">
              <X size={18} />
              Este ticket está cerrado. No puedes enviar más mensajes.
            </p>
          </div>
        ) : (
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSend} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition-all"
                placeholder="Escribe tu mensaje..."
                disabled={isSubmitting}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || message.trim() === ''}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all
                    ${(isSubmitting || message.trim() === '')
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
