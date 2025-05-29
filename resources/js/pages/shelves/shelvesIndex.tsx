"use client"

import type React from "react"

import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import type { Product, Shelf, SharedData } from "@/types"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Pagination } from "@/components/pagination"
import { router } from "@inertiajs/react"
import ShelfModal from "@/pages/shelves/create"
import ProductModal from "@/pages/product/create"

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

    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [shelfData, setShelfData] = useState({
        code: "",
        location: "",
        max_capacity: "",
    })
    const [shelfErrors, setShelfErrors] = useState({})
    const [processingShelf, setProcessingShelf] = useState(false)
    const [existingLocations, setExistingLocations] = useState<string[]>([])

    //ESTADO PARA CONTROLAR MENSAJES DE ÉXITO
    const [showedSuccessMessage, setShowedSuccessMessage] = useState(false)

    // Estado para el modal de productos
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        num_reference: "",
        stock: "",
        categoria: "",
        price: "",
        image_url: "",
    })
    const [productErrors, setProductErrors] = useState({})
    const [processingProduct, setProcessingProduct] = useState(false)
    const [categorias, setCategorias] = useState([])

    // Obtener ubicaciones existentes al montar el componente
    useEffect(() => {
        setExistingLocations(shelves.map((shelf) => shelf.location))
    }, [shelves])

    const handleSetShelfData = (key: string, value: any) => {
        setShelfData((prev) => {
            const newData = {
                ...prev,
                [key]: value,
            }
            return newData
        })
    }

    //FUNCIÓN ACTUALIZADA CON MENSAJE CORRECTO
    const handleSubmitShelf = async (e: React.FormEvent, completeData?: any) => {
        e.preventDefault()

        if (processingShelf) {
            return
        }

        setProcessingShelf(true)
        setShelfErrors({})

        // USAR DATOS COMPLETOS SI ESTÁN DISPONIBLES, SINO USAR ESTADO
        const submitData = completeData || {
            code: shelfData.code.trim(),
            location: shelfData.location.trim(),
            max_capacity: shelfData.max_capacity.trim(),
        }

        try {
            await router.post("/manager/shelves", submitData, {
                preserveScroll: true,
                onSuccess: (page) => {

                    //Cerrar modal y limpiar
                    setIsModalOpen(false)
                    setShelfData({ code: "", location: "", max_capacity: "" })
                    setShelfErrors({})

                    // MARCAR QUE YA MOSTRAMOS EL MENSAJE
                    setShowedSuccessMessage(true)

                    //MOSTRAR MENSAJE CORRECTO
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Estanteria creada correctamente.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        showConfirmButton: false,
                        timer: 3000,
                    })

                    // Recargar datos
                    setTimeout(() => {
                        router.reload({ only: ["shelves"] })
                    }, 500)
                },
                onError: (errors) => {bn
                    setShelfErrors(errors)

                    const errorMessages = Object.values(errors).flat()
                    const errorText = errorMessages.length > 0 ? errorMessages.join(", ") : "Error al crear estantería"

                    Swal.fire({
                        title: "Error",
                        text: errorText,
                        icon: "error",
                        background: "#F3F3DF",
                        confirmButtonColor: "#E17100",
                    })
                },
            })
        } catch (error) {
            console.error("❌ Error general:", error)
            Swal.fire({
                title: "Error",
                text: "Error inesperado",
                icon: "error",
                background: "#F3F3DF",
                confirmButtonColor: "#E17100",
            })
        } finally {
            setProcessingShelf(false)
        }
    }

    const handleSetProductData = (key: string, value: any) => {
        setProductData((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcessingProduct(true)

        try {
            await router.post("/admin/products", productData, {
                onSuccess: () => {
                    setIsProductModalOpen(false)
                    setProductData({
                        name: "",
                        description: "",
                        num_reference: "",
                        stock: "",
                        categoria: "",
                        price: "",
                        image_url: "",
                    })
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Producto creado correctamente",
                        icon: "success",
                        timer: 3000,
                        toast: true,
                        position: "top",
                        showConfirmButton: false,
                        background: "#F3F3DF",
                        iconColor: "#E17100",
                    })
                },
                onError: (errors) => {
                    setProductErrors(errors)
                },
            })
        } finally {
            setProcessingProduct(false)
        }
    }

    const resetProduct = () => {
        setProductData({
            name: "",
            description: "",
            num_reference: "",
            stock: "",
            categoria: "",
            price: "",
            image_url: "",
        })
        setProductErrors({})
    }

    const resetShelf = () => {
        setShelfData({
            code: "",
            location: "",
            max_capacity: "",
        })
        setShelfErrors({})
    }

    const clearErrors = () => {
        setShelfErrors({})
    }

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

    //MEJORAR MANEJO DE FLASH MESSAGES
    useEffect(() => {
        // Solo mostrar flash messages si no hemos mostrado ya un mensaje de éxito manual
        if (flash?.success && !showedSuccessMessage) {
            // Manejar el caso donde flash.success es boolean o string
            const successText =
                typeof flash.success === "string" && flash.success !== "true"
                    ? flash.success
                    : "Estantería creada correctamente."

            Swal.fire({
                title: "¡Éxito!",
                text: successText,
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: "top",
                showConfirmButton: false,
                background: "#F3F3DF",
                iconColor: "#E17100",
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
                background: "#F3F3DF",
            })
        }

        //RESETEAR EL FLAG DESPUÉS DE PROCESAR FLASH MESSAGES
        if (showedSuccessMessage) {
            setShowedSuccessMessage(false)
        }
    }, [flash, showedSuccessMessage])

    // Obtener categorías para el modal de productos
    useEffect(() => {
        fetch("/admin/products/categorias")
            .then((response) => response.json())
            .then((data) => setCategorias(data))
            .catch((error) => console.error("Error al obtener categorías:", error))
    }, [])

    const handleAssignShelf = (productId: number, shelfId: string) => {
        if (!shelfId) return

        setLocalProducts((prev) => prev.filter((p) => p.id !== productId))

        try {
            const url = `/manager/products/${productId}/assign-split`

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
                            title: "¡Éxito!",
                            text: "Producto asignado correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                            showConfirmButton: false,
                            timer: 3000,
                        })
                    },
                    onError: (errors) => {
                    // Restaurar el producto a la lista local
                    setLocalProducts(unassignedProducts);

                    const errorMessage = errors.quantity ?? "Error al asignar estantería";

                    Swal.fire({
                        title: "Error",
                        text: errorMessage,
                        icon: "error",
                        background: "#F3F3DF",
                        confirmButtonColor: "#E17100",
                    });
                    },
                },
            )
        } catch (error) {
            console.error("Route error:", error)
            Swal.fire({
                title: "Error",
                text: "Error en la configuración de rutas",
                icon: "error",
                background: "#F3F3DF",
                confirmButtonColor: "#E17100",
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

    // Get progress bar color based on capacity
    const getProgressBarColor = (percentage: number) => {
        if (percentage >= 100) return "bg-black"
        if (percentage >= 90) return "bg-red-500"
        if (percentage > 70) return "bg-yellow-500"
        return "bg-[#E17100]"
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Estanterías</h2>}
        >
            <Head title="Gestión de Estanterías" />

            {/* Modal para crear estantería */}
            <ShelfModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    resetShelf()
                }}
                shelfData={shelfData}
                setShelfData={handleSetShelfData}
                submitShelf={handleSubmitShelf}
                shelfErrors={shelfErrors}
                processingShelf={processingShelf}
                clearErrors={clearErrors}
                existingLocations={existingLocations}
            />

            {/* Modal para crear producto */}
            <ProductModal
                open={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                categorias={categorias}
                productData={productData}
                setProductData={handleSetProductData}
                submitProduct={handleSubmitProduct}
                productErrors={productErrors}
                processingProduct={processingProduct}
                resetProduct={resetProduct}
            />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Productos sin estantería */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium flex items-center text-[#E17100] dark:text-white">
                                    <span className="mr-2">📦</span>
                                    Productos sin ubicación ({localProducts.length})
                                </h3>

                                {localProducts.length > 0 && (
                                    <span className="px-3 py-1 bg-[#E17100] text-white rounded-full text-sm font-medium">
                                        {localProducts.length} producto{localProducts.length !== 1 ? "s" : ""} sin asignar
                                    </span>
                                )}
                            </div>

                            {localProducts.length === 0 ? (
                                <div className="text-center py-8 bg-[#F3F3DF] dark:bg-gray-700 rounded-lg">
                                    <svg
                                        className="mx-auto h-12 w-12 text-[#E17100]"
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
                                                className="border border-[#E17100]/20 rounded-lg p-4 flex flex-col bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                                                        <h4 className="font-medium text-[#E17100] dark:text-white">{product.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {product.num_reference}</p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F3DF] text-[#E17100] dark:bg-[#E17100]/20 dark:text-[#F3F3DF]">
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
                                                        className="block w-full pl-3 pr-10 py-2 text-base border-[#E17100]/30 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-[#E17100] focus:border-[#E17100] sm:text-sm rounded-md"
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
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium flex items-center text-[#E17100] dark:text-white">
                                    <span className="mr-2">🏷️</span>
                                    Todas las estanterías ({shelves.length})
                                </h3>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={processingShelf}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E17100] hover:bg-[#E17100]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E17100] disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        {processingShelf ? "Creando..." : "Crear Estantería"}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {currentShelves.map((shelf) => (
                                    <div
                                        key={shelf.id}
                                        className="border border-[#E17100]/20 rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-[#E17100] dark:text-white">{shelf.code}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{shelf.location}</p>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3F3DF] text-[#E17100] dark:bg-[#E17100]/20 dark:text-[#F3F3DF]">
                                                    {shelf.products?.length || 0} productos
                                                </span>
                                            </div>

                                            {shelf.max_capacity && (
                                                <div className="mt-2 mb-4">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600 dark:text-gray-300">Capacidad</span>
                                                        <span className="font-medium text-[#E17100] dark:text-white">
                                                            {getShelfCapacityInfo(shelf)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-[#F3F3DF] rounded-full h-2.5 dark:bg-gray-700">
                                                        <div
                                                            className={`h-2.5 rounded-full ${getProgressBarColor(getShelfCapacityPercentage(shelf))}`}
                                                            style={{ width: `${getShelfCapacityPercentage(shelf)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto pt-2">
                                                <Link
                                                    href={`/manager/shelves/${shelf.id}`}
                                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#E17100]/30 shadow-sm text-sm font-medium rounded-md text-[#E17100] bg-white hover:bg-[#F3F3DF] dark:bg-[#E17100] dark:text-white dark:border-[#E17100]/50 dark:hover:bg-[#E17100]/90"
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
