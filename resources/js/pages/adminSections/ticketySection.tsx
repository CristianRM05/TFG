"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Mail, Eye, Filter } from "lucide-react"
import TicketModal from "@/components/TicketModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ticket {
    id: number
    subject: string
    email?: string | null
    status: "abierto" | "cerrado"
    user?: {
        id: number
        name: string
    } | null
    created_at: string
    messages?: any[] // Añadir esta propiedad
}

interface Props {
    styles: any
    tickets: Ticket[]
    loading: boolean
    openSection: string | null
    setOpenSection: (section: string | null) => void
    ticketsPage: number
    setTicketsPage: (page: number) => void
    ticketsTotalPages: number
    ticketsPerPage: number
    totalTickets: number
    statusFilter?: string
    setStatusFilter?: (status: string) => void
}

const TicketSection: React.FC<Props> = ({
    styles,
    tickets,
    loading,
    openSection,
    setOpenSection,
    ticketsPage,
    setTicketsPage,
    ticketsTotalPages,
    ticketsPerPage,
    totalTickets,
    statusFilter = "all",
    setStatusFilter = () => { },
}) => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

    const handleViewTicket = async (ticketId: number) => {
        try {
            const res = await fetch(`/admin/tickets/${ticketId}`)
            const data = await res.json()
            if (data.success) {
                // Asegúrate de que el ticket tenga la propiedad messages
                setSelectedTicket({
                    ...data.ticket,
                    messages: data.ticket.messages || [], // Proporciona un array vacío si no hay mensajes
                })
            }
        } catch (err) {
            console.error("Error al cargar ticket:", err)
        }
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setTicketsPage(1) // Resetear a la primera página cuando cambia el filtro
    }

    return (
        <>
            {/* Header */}
            <div
                className="p-6 border-b cursor-pointer"
                style={{ borderColor: `${styles.secondary}30` }}
                onClick={() => setOpenSection(openSection === "tickets" ? null : "tickets")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail size={24} style={{ color: styles.primary }} />
                        <h2 className="text-2xl font-bold dark:text-black" style={{ color: styles.dark }}>
                            Gestión de Tickets
                        </h2>
                    </div>
                    {openSection === "tickets" ? (
                        <ChevronUp size={24} style={{ color: styles.primary }} />
                    ) : (
                        <ChevronDown size={24} style={{ color: styles.primary }} />
                    )}
                </div>
            </div>

            {/* Tabla */}
            {openSection === "tickets" && (
                <div className="overflow-x-auto">
                    {/* Filtro de estado */}
                    <div className="px-6 py-4 text-sm text-gray-600 flex justify-end">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-600">Filtrar por estado:</span>
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="abierto">Abiertos</SelectItem>
                                    <SelectItem value="cerrado">Cerrados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Cargando tickets...</div>
                    ) : (
                        <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                            <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                <tr>
                                    <th className="px-6 py-4 text-sm text-gray-600 font-medium uppercase" style={{ color: styles.secondary }}>
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-sm text-gray-600 font-medium uppercase" style={{ color: styles.secondary }}>
                                        Asunto
                                    </th>
                                    <th className="px-6 py-4 text-sm text-gray-600 font-medium uppercase" style={{ color: styles.secondary }}>
                                        Usuario
                                    </th>
                                    <th className="px-6 py-4 text-sm text-gray-600 font-medium uppercase" style={{ color: styles.secondary }}>
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-sm text-gray-600 font-medium uppercase" style={{ color: styles.secondary }}>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600">#{ticket.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{ticket.subject}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {ticket.user?.name ?? ticket.email ?? "Anónimo"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${ticket.status === "abierto" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleViewTicket(ticket.id)}
                                                    className="px-3 py-1 rounded-md text-sm font-medium"
                                                    style={{
                                                        backgroundColor: styles.primary,
                                                        color: "white",
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 inline mr-1" /> Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No hay tickets{" "}
                                            {statusFilter !== "all" ? (statusFilter === "abierto" ? "abiertos" : "cerrados") : ""} registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Paginación */}
                    {ticketsTotalPages > 1 && (
                        <div className="flex items-center justify-between p-6 text-sm text-gray-600">
                            <div>
                                Mostrando {(ticketsPage - 1) * ticketsPerPage + 1}-
                                {Math.min(ticketsPage * ticketsPerPage, totalTickets)} de {totalTickets}
                            </div>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setTicketsPage(Math.max(1, ticketsPage - 1))}
                                    disabled={ticketsPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    style={{ color: styles.secondary }}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {Array.from({ length: Math.min(5, ticketsTotalPages) }, (_, i) => {
                                    let page
                                    if (ticketsTotalPages <= 5) {
                                        page = i + 1
                                    } else if (ticketsPage <= 3) {
                                        page = i + 1
                                    } else if (ticketsPage >= ticketsTotalPages - 2) {
                                        page = ticketsTotalPages - 4 + i
                                    } else {
                                        page = ticketsPage - 2 + i
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setTicketsPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium ${ticketsPage === page ? "shadow-md" : ""}`}
                                            style={{
                                                backgroundColor: ticketsPage === page ? styles.primary : "transparent",
                                                color: ticketsPage === page ? "white" : styles.secondary,
                                                border: ticketsPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                            }}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                                <button
                                    onClick={() => setTicketsPage(Math.min(ticketsTotalPages, ticketsPage + 1))}
                                    disabled={ticketsPage === ticketsTotalPages}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    style={{ color: styles.secondary }}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
        </>
    )
}

export default TicketSection
