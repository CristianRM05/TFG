"use client"

import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import type { Product, Shelf, SharedData } from "@/types"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Pagination } from "@/components/pagination"
import { router } from "@inertiajs/react"

interface ShelvesPageProps extends SharedData {
    shelves: Shelf[]
    unassignedProducts: Product[]
    flash?: {
        success?: string
        error?: string
    }
}

export default function ShelvesIndex() {
    const { shelves, unassignedProducts, flash, auth } = usePage<ShelvesPageProps>().props

    // Add this to debug available routes
    console.log("Available routes:", window.Ziggy?.routes || "No routes found")

    const [localProducts, setLocalProducts] = useState(unassignedProducts.filter((product) => product.stock > 0))

    // Pagination for unassigned products
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 6
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = localProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(localProducts.length / productsPerPage)

    // Pagination for shelves
    const [currentShelfPage, setCurrentShelfPage] = useState(1)
    const shelvesPerPage = 8
    const indexOfLastShelf = currentShelfPage * shelvesPerPage
    const indexOfFirstShelf = indexOfLastShelf - shelvesPerPage
    const currentShelves = shelves.slice(indexOfFirstShelf, indexOfLastShelf)
    const totalShelfPages = Math.ceil(shelves.length / shelvesPerPage)

    // Update local products when props change
    useEffect(() => {
        setLocalProducts(unassignedProducts.filter((product) => product.stock > 0))
    }, [unassignedProducts])

    // Show success message when flash changes
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: "¡Éxito!",
                text: flash.success || "Operación realizada correctamente",
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

    const handleAssignShelf = (productId: number, shelfId: string) => {
        if (!shelfId) return

        setLocalProducts((prev) => prev.filter((p) => p.id !== productId))

        // Check if route exists before using it
        try {
            const url = route("products.assign-split", {
                product: productId,
            })

            router.put(
                url,
                {
                    shelf_id: Number.parseInt(shelfId),
                    quantity: localProducts.find((p) => p.id === productId)?.stock || 0,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "¡Asignado!",
                            text: "Producto asignado correctamente",
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top",
                            showConfirmButton: false,
                        })
                    },
                    onError: () => {
                        setLocalProducts(unassignedProducts)
                        Swal.fire({
                            title: "Error",
                            text: "Error al asignar estantería",
                            icon: "error",
                            confirmButtonColor: "#3085d6",
                        })
                    },
                },
            )
        } catch (error) {
            console.error("Route error:", error)
            Swal.fire({
                title: "Error",
                text: "Error en la configuración de rutas",
                icon: "error",
                confirmButtonColor: "#3085d6",
            })
        }
    }

    // Calculate current capacity for each shelf
    const getShelfCapacityInfo = (shelf: Shelf) => {
        if (!shelf.max_capacity) return null

        const currentStock = shelf.products?.reduce((total, p) => total + p.stock, 0) || 0
        return `${currentStock}/${shelf.max_capacity} unidades`
    }

    const isShelfFull = (shelf: Shelf) => {
        if (!shelf.max_capacity) return false
        const currentStock = shelf.products?.reduce((total, p) => total + p.stock, 0) || 0
        return currentStock >= shelf.max_capacity
    }

    // Calculate shelf capacity percentage for progress bar
    const getShelfCapacityPercentage = (shelf: Shelf) => {
        if (!shelf.max_capacity) return 0
        const currentStock = shelf.products?.reduce((total, p) => total + p.stock, 0) || 0
        return Math.min(100, Math.round((currentStock / shelf.max_capacity) * 100))
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Estanterías</h2>}
        >
            <Head title="Gestión de Estanterías" />

            <div className="py-6 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Productos sin estantería */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium flex items-center text-gray-900 dark:text-white">
                                    <span className="mr-2">📦</span>
                                    Productos sin ubicación ({localProducts.length})
                                </h3>

                                {localProducts.length > 0 && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                        {localProducts.length} producto{localProducts.length !== 1 ? "s" : ""} sin asignar
                                    </span>
                                )}
                            </div>

                            {localProducts.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">¡Todo en orden!</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Todos los productos están asignados a estanterías.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currentProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="border dark:border-gray-700 rounded-lg p-4 flex flex-col bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                <div className="flex items-start">
                                                    {product.image_url && (
                                                        <img
                                                            src={product.image_url || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="h-16 w-16 rounded-md object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {product.num_reference}</p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                Stock: {product.stock}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Asignar a:
                                                    </label>
                                                    <select
                                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        onChange={(e) => handleAssignShelf(product.id, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled className="dark:bg-gray-800">
                                                            Seleccionar estantería...
                                                        </option>
                                                        {shelves.map((shelf) => {
                                                            const full = isShelfFull(shelf)
                                                            return (
                                                                <option
                                                                    key={shelf.id}
                                                                    value={shelf.id}
                                                                    className={`dark:bg-gray-700 ${full ? "text-gray-400" : ""}`}
                                                                    disabled={full}
                                                                >
                                                                    {shelf.code} - {shelf.location}
                                                                    {shelf.max_capacity && <span> ({getShelfCapacityInfo(shelf)})</span>}
                                                                    {full && " (Llena)"}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination for products */}
                                    {totalPages > 1 && (
                                        <div className="mt-6">
                                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Todas las estanterías */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium flex items-center text-gray-900 dark:text-white">
                                    <span className="mr-2">🏷️</span>
                                    Todas las estanterías ({shelves.length})
                                </h3>

                                {/* Replace route with a hardcoded URL or check if it exists first */}
                                <Link
                                    href="/manager/shelves/create" // Use a hardcoded URL instead of route()
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
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
                                    Nueva Estantería
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {currentShelves.map((shelf) => (
                                    <div
                                        key={shelf.id}
                                        className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{shelf.code}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{shelf.location}</p>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                                    {shelf.products?.length || 0} productos
                                                </span>
                                            </div>

                                            {shelf.max_capacity && (
                                                <div className="mt-2 mb-4">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600 dark:text-gray-300">Capacidad</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {getShelfCapacityInfo(shelf)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getShelfCapacityPercentage(shelf) >= 100
                                                                    ? 'bg-black'
                                                                    : getShelfCapacityPercentage(shelf) >= 99
                                                                        ? 'bg-red-500'
                                                                        : getShelfCapacityPercentage(shelf) > 85
                                                                            ? 'bg-red-500'
                                                                            : getShelfCapacityPercentage(shelf) > 50
                                                                                ? 'bg-yellow-500'
                                                                                : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${getShelfCapacityPercentage(shelf)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-2">
                                                {/* Replace route with a hardcoded URL */}
                                                <Link
                                                    href={`/manager/shelves/${shelf.id}`} // Use a hardcoded URL pattern
                                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination for shelves */}
                            {totalShelfPages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={currentShelfPage}
                                        totalPages={totalShelfPages}
                                        onPageChange={setCurrentShelfPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
