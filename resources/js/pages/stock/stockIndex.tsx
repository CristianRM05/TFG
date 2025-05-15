
import type React from "react"
import { useState, useEffect } from "react"
import { Head, router } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import type { StockProduct } from "../../app"
import { Pagination } from "@/components/pagination"
import { Search, Box, MapPin, Package, ArrowRight } from "lucide-react"

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Adjust this number based on your preference

  // Flatten products with stocks for easier pagination
  const flattenedProducts = products.flatMap(
    (product) =>
      product.stocks?.map((stock, idx) => ({
        ...product,
        stock,
        stockIdx: idx,
      })) || [],
  )

  // Get current products for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = flattenedProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(flattenedProducts.length / itemsPerPage)

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  return (
    <AppLayout user={auth.user} header={<h2 className="text-2xl font-bold text-amber-800">Gestión de Inventario</h2>}>
      <Head title="Gestión de Inventario" />

      <div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          {/* Header with search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-amber-900">Inventario de Productos</h1>
              <p className="text-amber-700 mt-1">Gestiona tu stock de manera eficiente</p>
            </div>

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-amber-500" />
              </div>
              <input
                type="text"
                className="bg-white border border-amber-300 text-amber-900 pl-10 pr-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#E17100] focus:border-transparent"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {showResults && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-amber-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-amber-100 last:border-b-0"
                        onClick={() => navigateToProduct(product.id)}
                      >
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-8 h-8 rounded-full object-cover border border-amber-200"
                            />
                          )}
                          <div>
                            <p className="font-medium text-amber-900">{product.name}</p>
                            <p className="text-xs text-amber-700">Ref: {product.num_reference}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-amber-700 text-center">No se encontraron productos</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flattenedProducts.length > 0 ? (
              currentProducts.map((item) => (
                <div
                  key={`${item.id}-${item.stockIdx}`}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-md border-l-4 border-[#E17100] hover:shadow-lg transition-shadow"
                >
                  {/* Imagen y nombre */}
                  <div className="flex items-center gap-4 mb-5">
                    {item.image_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-200">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-amber-900">{item.name}</h2>
                      <p className="font-medium text-[#E17100]">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-amber-700" />
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">Ref:</span> {item.num_reference}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">Ubicación:</span> {item.stock.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-700" />
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">Capacidad Estantería:</span>{" "}
                        {item.stock.shelf?.max_capacity ?? "–"}
                      </p>
                    </div>
                  </div>

                  {/* Stock y acciones */}
                  <div className="mt-auto pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                        item.stock.available_quantity <= 10
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {item.stock.available_quantity} uds.
                    </span>
                    <button
                      onClick={() => navigateToProduct(item.id)}
                      className="px-4 py-2 bg-[#E17100] hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      Ver Producto
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-xl p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Package className="w-12 h-12 text-amber-300" />
                  <p className="text-lg font-medium text-amber-800">No hay productos en stock</p>
                  <p className="text-amber-600">Agrega productos a tu inventario para comenzar</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="text-amber-900 bg-white border border-amber-200 rounded-lg shadow-sm">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default StockIndex

export interface BreadcrumbItem {
  title: string
  href?: string
}
