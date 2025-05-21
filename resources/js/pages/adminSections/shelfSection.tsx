// components/ShelfSection.tsx
"use client"

import React from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Package2, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { router } from "@inertiajs/react"

interface Shelf {
    id: number
    code: string
    location: string
    max_capacity: number
    total_stock: number
    products_count: number
    capacity_percentage: number
    created_at: string
}

interface Props {
    styles: any
    shelves: Shelf[]
    loading: boolean
    openSection: string | null
    setOpenSection: (section: string | null) => void
    shelvesPage: number
    setShelvesPage: (page: number) => void
    shelvesTotalPages: number
    shelvesPerPage: number
    totalShelves: number
    handleDeleteShelf: (shelfId: number) => void
}

const ShelfSection: React.FC<Props> = ({
    styles,
    shelves,
    loading,
    openSection,
    setOpenSection,
    shelvesPage,
    setShelvesPage,
    shelvesTotalPages,
    shelvesPerPage,
    totalShelves,
    handleDeleteShelf
}) => {
    return (
        <>
            {/* Header de sección */}
            <div
                className="p-6 border-b cursor-pointer"
                style={{ borderColor: `${styles.secondary}30` }}
                onClick={() => setOpenSection(openSection === "shelves" ? null : "shelves")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package2 size={24} style={{ color: styles.primary }} />
                        <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>Gestión de Estanterías</h2>
                    </div>
                    {openSection === "shelves" ? (
                        <ChevronUp size={24} style={{ color: styles.primary }} />
                    ) : (
                        <ChevronDown size={24} style={{ color: styles.primary }} />
                    )}
                </div>
            </div>

            {/* Tabla de estanterías */}
            {openSection === "shelves" && (
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Cargando estanterías...</div>
                    ) : (
                        <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                            <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs uppercase font-medium" style={{ color: styles.secondary }}>Código</th>
                                    <th className="px-6 py-4 text-left text-xs uppercase font-medium" style={{ color: styles.secondary }}>Ubicación</th>
                                    <th className="px-6 py-4 text-left text-xs uppercase font-medium" style={{ color: styles.secondary }}>Capacidad</th>
                                    <th className="px-6 py-4 text-left text-xs uppercase font-medium" style={{ color: styles.secondary }}>Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs uppercase font-medium" style={{ color: styles.secondary }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                {shelves.length > 0 ? shelves.map(shelf => (
                                    <tr key={shelf.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium" style={{ color: styles.dark }}>{shelf.code}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{shelf.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {shelf.total_stock} / {shelf.max_capacity} unidades ({shelf.products_count} productos)
                                            <div className="w-full bg-gray-200 rounded h-2 mt-1 overflow-hidden">
                                                <div
                                                    className={`h-full ${shelf.capacity_percentage >= 100
                                                        ? 'bg-black'
                                                        : shelf.capacity_percentage > 85
                                                            ? 'bg-red-500'
                                                            : shelf.capacity_percentage > 50
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                    }`}
                                                    style={{ width: `${shelf.capacity_percentage}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(shelf.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleDeleteShelf(shelf.id)}
                                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                                style={{
                                                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                                                    color: "#dc2626",
                                                }}
                                            >
                                                <Trash2 className="inline w-4 h-4 mr-1" /> Borrar
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No hay estanterías registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Paginación */}
                    {shelvesTotalPages > 1 && (
                        <div className="flex items-center justify-between p-6 text-sm text-gray-600">
                            <div>
                                Mostrando {(shelvesPage - 1) * shelvesPerPage + 1}-{Math.min(shelvesPage * shelvesPerPage, totalShelves)} de {totalShelves}
                            </div>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => setShelvesPage(Math.max(1, shelvesPage - 1))}
                                    disabled={shelvesPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    style={{ color: styles.secondary }}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {Array.from({ length: Math.min(5, shelvesTotalPages) }, (_, i) => {
                                    let page;
                                    if (shelvesTotalPages <= 5) {
                                        // Si hay 5 o menos páginas, muestra todas (1, 2, 3, 4, 5)
                                        page = i + 1;
                                    } else if (shelvesPage <= 3) {
                                        // Si estamos en las primeras 3 páginas, muestra (1, 2, 3, 4, 5)
                                        page = i + 1;
                                    } else if (shelvesPage >= shelvesTotalPages - 2) {
                                        // Si estamos en las últimas 3 páginas, muestra (total-4, total-3, total-2, total-1, total)
                                        page = shelvesTotalPages - 4 + i;
                                    } else {
                                        // Páginas intermedias: muestra (current-2, current-1, current, current+1, current+2)
                                        page = shelvesPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setShelvesPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium ${shelvesPage === page ? "shadow-md" : ""}`}
                                            style={{
                                                backgroundColor: shelvesPage === page ? styles.primary : "transparent",
                                                color: shelvesPage === page ? "white" : styles.secondary,
                                                border: shelvesPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                            }}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button onClick={() => setShelvesPage(Math.min(shelvesTotalPages, shelvesPage + 1))}
                                    disabled={shelvesPage === shelvesTotalPages}
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
        </>
    )
}

export default ShelfSection
