"use client"

import type React from "react"
import { Head } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"

interface Product {
    id: number
    name: string
    description: string | null
    num_reference: string
    stock: number
    price: number
    discount_percent: number | null
    final_price: number | null
    image_url: string | null
    categoria: string
    shelf_id: number | null
    created_at: string | null
    updated_at: string | null
    shelf?: {
        id: number
        location: string
        max_capacity: number
    } | null
}

interface Props {
    product: Product
    auth: {
        user: {
            name: string
            email: string
        }
    }
}

const ShowProduct: React.FC<Props> = ({ product, auth }) => {
    return (
        <AppLayout user={auth.user} header={<h2 className="text-2xl font-bold text-white">Detalles del Producto</h2>}>
            <Head title={`Detalles de ${product.name}`} />

            <div className="min-h-screen bg-black text-white py-12">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
                        {/* Encabezado con imagen y nombre */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <img
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-64 h-64 rounded-lg object-cover border border-white/30"
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-2xl font-semibold">
                                        ${product.final_price ? product.final_price.toFixed(2) : product.price.toFixed(2)}
                                    </span>
                                    {product.discount_percent && (
                                        <span className="text-sm line-through text-gray-400">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                    {product.discount_percent && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            -{product.discount_percent}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-300 mb-6">
                                    {product.description || "No hay descripción disponible."}
                                </p>
                            </div>
                        </div>

                        {/* Detalles del producto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/30 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-3">Información General</h2>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Referencia:</span> {product.num_reference}</p>
                                    <p><span className="font-medium">Categoría:</span> {product.categoria}</p>
                                    <p><span className="font-medium">Stock disponible:</span> {product.stock} unidades</p>
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-3">Ubicación en Almacén</h2>
                                <div className="space-y-2">
                                    {product.shelf ? (
                                        <>
                                            <p><span className="font-medium">Estantería:</span> {product.shelf.location}</p>
                                            <p><span className="font-medium">Capacidad máxima:</span> {product.shelf.max_capacity} unidades</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400">No asignado a estantería</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-black/30 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-3">Fechas</h2>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Creado:</span>{" "}
                                        {product.created_at
                                            ? new Date(product.created_at).toLocaleString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })
                                            : "No disponible"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Actualizado:</span>{" "}
                                        {product.updated_at
                                            ? new Date(product.updated_at).toLocaleString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })
                                            : "No disponible"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default ShowProduct