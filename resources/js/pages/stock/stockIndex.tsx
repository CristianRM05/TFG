import type React from "react"
import { useState, useEffect } from "react"
import { Head, router } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import type { StockProduct } from "../../app"
import { Pagination } from "@/components/pagination"
import { Search, Box, MapPin, Package, ArrowRight, Eye, EyeOff } from "lucide-react"

interface Props {
  products: StockProduct[]
  auth: {
    user: {
      name: string
      email: string

    }
  }
}

const StockIndex: React.FC<Props> = ({ products, auth }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<StockProduct[]>([])
  const [showResults, setShowResults] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const flattenedProducts = products.flatMap(
    (product) =>
      product.stocks?.map((stock, idx) => ({
        ...product,
        stock,
        stockIdx: idx,
        is_visible: product.is_visible,
      })) || []
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = flattenedProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(flattenedProducts.length / itemsPerPage)

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [searchTerm, products])

  const navigateToProduct = (productId: number) => {
    setShowResults(false)
    setSearchTerm("")
    router.visit(`/manager/products/${productId}`)
  }

  const toggleVisibility = (productId: number) => {
    router.patch(`/products/${productId}/toggle-visibility`, {}, {
      preserveScroll: true,
    })
  }

  return (
    <AppLayout user={auth.user} header={<h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400">Gestión de Inventario</h2>}>
      <Head title="Gestión de Inventario" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        {/* Header with search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-900 dark:text-amber-300">Inventario de Productos</h1>
            <p className="text-amber-700 dark:text-amber-400 mt-1">Gestiona tu stock de manera eficiente</p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border  border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-900 pl-10 pr-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#E17100] dark:focus:ring-amber-500 focus:border-transparent"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {showResults && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-3 hover:bg-amber-50 dark:hover:bg-gray-700  cursor-pointer border-b border-amber-100 dark:border-gray-600 last:border-b-0"
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-200 dark:border-amber-600"
                          />
                        )}
                        <div>
                          <p className="font-medium text-amber-900 dark:text-amber-200">{product.name}</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">Ref: {product.num_reference}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-amber-700 dark:text-amber-400 text-center">No se encontraron productos</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((item) => (
              <div
                key={`${item.id}-${item.stockIdx}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-md border-l-4 border-[#E17100] dark:border-amber-500 hover:shadow-lg transition-shadow"
              >
                {/* Imagen y nombre */}
                <div className="flex items-center gap-4 mb-5">
                  {item.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-200 dark:border-amber-600">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-200">{item.name}</h2>
                    <p className="font-medium text-[#E17100] dark:text-amber-400">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <span className="font-medium">Ref:</span> {item.num_reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <span className="font-medium">Ubicación:</span> {item.stock.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <span className="font-medium">Capacidad Estantería:</span>{" "}
                      {item.stock.shelf?.max_capacity ?? "–"}
                    </p>
                  </div>
                </div>

                {/* Stock y acciones */}
                <div className="mt-auto pt-3 border-t border-amber-100 dark:border-gray-600 flex flex-col gap-2">
                  <span
                    className={`px-3 py-1.5 text-sm font-medium rounded-full w-fit ${
                      item.stock.available_quantity <= 10
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700"
                        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                    }`}
                  >
                    {item.stock.available_quantity} uds.
                  </span>

                  <div className="flex gap-2 justify-between">
                    <button
                      onClick={() => navigateToProduct(item.id)}
                      className="px-4 py-2 bg-[#E17100] dark:bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-700 text-white text-sm font-medium rounded-lg flex items-center gap-1"
                    >
                      Ver Producto <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleVisibility(item.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1 ${
                        item.is_visible
                          ? "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-400"
                          : "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-400"
                      }`}
                    >
                      {item.is_visible ? "Ocultar" : "Mostrar"}
                      {item.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Package className="w-12 h-12 text-amber-300 dark:text-amber-500" />
                <p className="text-lg font-medium text-amber-800 dark:text-amber-300">No hay productos en stock</p>
                <p className="text-amber-600 dark:text-amber-400">Agrega productos a tu inventario para comenzar</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="text-amber-900 dark:text-amber-200 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-600 rounded-lg shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default StockIndex

export interface BreadcrumbItem {
  title: string
  href?: string
}
