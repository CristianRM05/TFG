"use client"

import type React from "react"

import { Head, usePage, router } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import type { Product, SharedData } from "@/types"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Pagination } from "@/components/pagination"
interface DiscountsPageProps extends SharedData {
    products?: Product[] // Hacer opcional
    productsWithoutDiscount?: Product[] // Hacer opcional
    flash?: {
        success?: string
        error?: string
    }
}

export default function DiscountsIndex() {
    const { products = [], productsWithoutDiscount = [], flash, auth } = usePage<DiscountsPageProps>().props

    // Estados iniciales seguros
    const [discounts, setDiscounts] = useState<Product[]>(products)
    const [availableProducts, setAvailableProducts] = useState<Product[]>(productsWithoutDiscount)
    const [formData, setFormData] = useState({
        product_id: "",
        discount_percent: "",
    })
    const [loading, setLoading] = useState(false)

    // Pagination for discounts
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentDiscounts = discounts.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(discounts.length / itemsPerPage)

    // Update state when props change
    useEffect(() => {
        setDiscounts(products)
        setAvailableProducts(productsWithoutDiscount)
    }, [products, productsWithoutDiscount])

    // Show success message when flash changes
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: "¡Éxito!",
                text: flash.success || "Operación realizada con éxito",
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: "top",
                showConfirmButton: false,
            })
        } else if (flash?.error) {
            Swal.fire({
                title: "Error",
                text: flash.error,
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: "top",
                showConfirmButton: false,
            })
        }
    }, [flash])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await router.post(route("discounts.store"), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        title: "¡Descuento aplicado!",
                        text: "El descuento ha sido aplicado correctamente",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                        toast: true,
                        position: "top",
                        showConfirmButton: false,
                    })
                    setFormData({ product_id: "", discount_percent: "" })
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo aplicar el descuento",
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                    })
                    console.error("Error details:", errors)
                },
            })
        } catch (error) {
            console.error("Error applying discount:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (productId: number) => {
        Swal.fire({
            title: "¿Eliminar descuento?",
            text: "¿Estás seguro de eliminar este descuento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/manager/discounts/${productId}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: "El descuento ha sido eliminado correctamente",
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top",
                            showConfirmButton: false,
                        })
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar el descuento",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                        })
                    },
                })
            }
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Calculate final price with discount
    const calculateFinalPrice = (price: number | undefined, discountPercent: number | undefined) => {
        if (price === undefined || discountPercent === undefined) return 0
        return price * (1 - discountPercent / 100)
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Descuentos</h2>}
        >
            <Head title="Gestión de Descuentos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        {/* Formulario para añadir descuento */}
                        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Añadir Nuevo Descuento</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto</label>
                                        <select
                                            name="product_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={formData.product_id}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar producto</option>
                                            {availableProducts?.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} (${product.price?.toFixed(2)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Porcentaje de Descuento (%)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                name="discount_percent"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                className="block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={formData.discount_percent}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500 dark:text-gray-400">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Aplicando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="-ml-1 mr-2 h-5 w-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Aplicar Descuento
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Lista de descuentos activos */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Descuentos Activos</h3>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100">
                                    {discounts.length} descuento{discounts.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {discounts.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay descuentos</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        No hay productos con descuento actualmente.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Producto
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Precio Original
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Descuento
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Precio Final
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {currentDiscounts.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {product.image_url && (
                                                                    <img
                                                                        src={product.image_url || "/placeholder.svg"}
                                                                        alt={product.name}
                                                                        className="h-10 w-10 rounded-full mr-3 object-cover"
                                                                    />
                                                                )}
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            ${product.price?.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.discount_percent >= 50 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                                                                product.discount_percent >= 30 ? 'bg-amber-100 text-amber-700 dark:bg-amber-600/40 dark:text-amber-50' :
                                                                        product.discount_percent > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                {product.discount_percent}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                                ${calculateFinalPrice(product.price, product.discount_percent).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                <svg
                                                                    className="-ml-0.5 mr-1 h-4 w-4"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
