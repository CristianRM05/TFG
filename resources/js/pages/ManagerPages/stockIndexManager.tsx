import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "../../layouts/app-layout";
import type { StockProduct } from "../../app";
import { Pagination } from "@/components/pagination";
import { Search, Eye, EyeOff, ArrowRight } from "lucide-react";

interface Props {
  products: StockProduct[];
  auth: {
    user: {
      name: string;
      email: string;
      role: string;
    };
  };
}

const StockIndexManager: React.FC<Props> = ({ products, auth }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<StockProduct[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const flattenedProducts = products.flatMap((product) =>
    product.stocks?.map((stock, idx) => ({
      ...product,
      stock,
      stockIdx: idx,
    })) || []
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = flattenedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flattenedProducts.length / itemsPerPage);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, products]);

  const navigateToProduct = (productId: number) => {
    setShowResults(false);
    setSearchTerm("");
    router.visit(`/manager/products/${productId}`);
  };

const toggleVisibility = (productId: number) => {
  router.patch(`/products/${productId}/toggle-visibility`, {}, {
    preserveScroll: true,
  });
};


  return (
    <AppLayout user={auth.user} header={<h2 className="text-2xl font-bold text-amber-800">Gestión de Inventario</h2>}>
      <Head title="Gestión de Inventario (Manager)" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 py-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-amber-900">Inventario completo</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-5 w-5 text-amber-500" />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-amber-300 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {showResults && (
              <div className="absolute z-10 mt-1 bg-white w-full border border-amber-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer"
                    onClick={() => navigateToProduct(product.id)}
                  >
                    {product.name}
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-4 py-2 text-sm text-center text-amber-500">Sin resultados</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? currentProducts.map((item) => (
            <div
              key={`${item.id}-${item.stockIdx}`}
              className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border border-amber-300"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold text-amber-800">{item.name}</h2>
                  <p className="text-sm text-amber-600">Ref: {item.num_reference}</p>
                  <p className="text-sm font-semibold text-amber-700">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="text-sm text-amber-800 space-y-1 mb-4">
                <p><strong>Ubicación:</strong> {item.stock.location}</p>
                <p><strong>Capacidad estantería:</strong> {item.stock.shelf?.max_capacity ?? "–"}</p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-amber-100">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  item.stock.available_quantity <= 10
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}>
                  {item.stock.available_quantity} uds.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateToProduct(item.id)}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg flex items-center gap-1"
                  >
                    Ver <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg flex items-center gap-1 ${
                      item.is_visible
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {item.is_visible ? (
                      <>
                        Ocultar <EyeOff className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Mostrar <Eye className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-amber-600 py-12">
              <Package className="w-10 h-10 mx-auto mb-2 text-amber-300" />
              <p className="text-lg font-medium">No hay productos registrados</p>
              <p className="text-sm">Puedes crear nuevos productos desde el panel de gestión</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StockIndexManager;
