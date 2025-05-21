// components/ProductSection.tsx
"use client"

import React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Package, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import { router } from "@inertiajs/react"

interface Product {
    id: number
    name: string
    description?: string | null
    num_reference: string
    stock: number
    price: number
    image_url?: string | null
    categoria: string
    shelf_id: number | null
    created_at: string
    updated_at: string
    discount_percent?: number
}

interface Shelf {
    id: number
    code: string
}

interface Props {
    styles: any
    products: Product[]
    loading: boolean
    openSection: string | null
    setOpenSection: (section: string | null) => void
    productsPage: number
    setProductsPage: (page: number) => void
    productsTotalPages: number
    productsPerPage: number
    totalProducts: number
    allShelvesForProducts: Shelf[]
    handleDeleteProduct: (productId: number) => void
}

const ProductSection: React.FC<Props> = ({
    styles,
    products,
    loading,
    openSection,
    setOpenSection,
    productsPage,
    setProductsPage,
    productsTotalPages,
    productsPerPage,
    totalProducts,
    allShelvesForProducts,
    handleDeleteProduct
}) => {
    return (
        <>
            {/* Header */}
            <div
                className="p-6 border-b cursor-pointer"
                style={{ borderColor: `${styles.secondary}30` }}
                onClick={() => setOpenSection(openSection === "products" ? null : "products")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package size={24} style={{ color: styles.primary }} />
                        <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>
                            Gestión de Productos
                        </h2>
                    </div>
                    {openSection === "products" ? (
                        <ChevronUp size={24} style={{ color: styles.primary }} />
                    ) : (
                        <ChevronDown size={24} style={{ color: styles.primary }} />
                    )}
                </div>
            </div>

            {/* Tabla */}
            {openSection === "products" && (
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600">Cargando productos...</div>
                    ) : (
                        <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                            <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Imagen</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Referencia</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Stock</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Precio</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Descuento (%)</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Precio Final</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Estantería</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                {products.length > 0 ? products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
                                            ) : (
                                                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                                                    <Package size={20} style={{ color: styles.secondary }} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium" style={{ color: styles.dark }}>{product.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.num_reference}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.price}€</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.discount_percent ?? 0}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {((product.price ?? 0) * (1 - (product.discount_percent ?? 0) / 100)).toFixed(2)}€
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.shelf_id
                                                ? allShelvesForProducts.find(s => s.id === product.shelf_id)?.code ?? `ID: ${product.shelf_id}`
                                                : "Sin asignar"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="px-3 py-1 rounded-md text-sm font-medium ml-2"
                                                style={{
                                                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                                                    color: "#dc2626"
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3 inline mr-1" /> Borrar
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No hay productos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Paginación */}
                    {(productsTotalPages > 1 || Math.ceil(totalProducts / productsPerPage) > 1) && (
                        <div className="flex items-center justify-between p-6 text-sm text-gray-600">
                            <div>
                                Mostrando {(productsPage - 1) * productsPerPage + 1}-{Math.min(productsPage * productsPerPage, totalProducts)} de {totalProducts}
                            </div>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setProductsPage(Math.max(1, productsPage - 1))}
                                    disabled={productsPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                    style={{ color: styles.secondary }}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {Array.from({ length: Math.min(5, productsTotalPages) }, (_, i) => {
                                    let page;
                                    if (productsTotalPages <= 5) {
                                        page = i + 1;
                                    } else if (productsPage <= 3) {
                                        page = i + 1;
                                    } else if (productsPage >= productsTotalPages - 2) {
                                        page = (productsTotalPages - 5) + i + 1;  
                                    } else {
                                        page = productsPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setProductsPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium ${productsPage === page ? "shadow-md" : ""}`}
                                            style={{
                                                backgroundColor: productsPage === page ? styles.primary : "transparent",
                                                color: productsPage === page ? "white" : styles.secondary,
                                                border: productsPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                            }}>
                                            {page}
                                        </button>
                                    )
                                })}
                                <button
                                    onClick={() => setProductsPage(Math.min(productsTotalPages, productsPage + 1))}
                                    disabled={productsPage === productsTotalPages}
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

export default ProductSection
