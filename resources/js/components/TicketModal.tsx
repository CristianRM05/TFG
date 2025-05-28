import React, { useState } from "react"
import axios from "axios"

interface Message {
  id: number
  message: string
  sender_type: string
  created_at: string
}

interface Ticket {
  id: number
  subject: string
  status: string
  email?: string
  user?: { id: number; name: string }
  messages: Message[]
}

interface Props {
  ticket: Ticket
  onClose: () => void
}

const TicketModal: React.FC<Props> = ({ ticket, onClose }) => {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(ticket.messages)
  const [status, setStatus] = useState(ticket.status)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!newMessage.trim()) return
    setLoading(true)

    try {
      await axios.post(`/admin/tickets/${ticket.id}/reply`, { message: newMessage })
      const now = new Date().toISOString()
      setMessages([
        ...messages,
        {
          id: Date.now(),
          message: newMessage,
          sender_type: "admin",
          created_at: now,
        },
      ])
      setNewMessage("")
    } catch (err) {
      console.error("Error enviando mensaje", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseTicket = async () => {
    try {
      await axios.patch(`/admin/tickets/${ticket.id}`, { status: "cerrado" })
      setStatus("cerrado")
    } catch (err) {
      console.error("Error cerrando el ticket", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
          Ticket #{ticket.id}: {ticket.subject}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Estado:{" "}
          <span className={`font-semibold ${status === "cerrado" ? "text-red-600" : "text-green-500"}`}>
            {status}
          </span>
        </p>

        <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {msg.sender_type === "admin" ? "👨‍💼 Admin" : "👤 Usuario"}
              </div>
              <div className="text-gray-700 dark:text-gray-300">{msg.message}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {status === "abierto" && (
          <>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded p-2 mb-3"
              placeholder="Responder al ticket..."
            />
            <div className="flex justify-between gap-2 mb-3">
              <button
                onClick={handleCloseTicket}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Cerrar Ticket
              </button>
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicketModal
