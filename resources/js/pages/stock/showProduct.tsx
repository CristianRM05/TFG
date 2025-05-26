import type React from "react"
import { useState } from "react"
import { Head, Link, useForm, router } from "@inertiajs/react"
import AppLayout from "../../layouts/app-layout"
import { Edit, X, Save } from "lucide-react"
import Swal from 'sweetalert2'

const COLORS = {
    primary: '#8F5C0C',
    secondary: '#7C5F42',
    black: '#000000',
    white: '#F3F3F1',
};

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
        total_stock: number
        products_count?: number
        capacity_percentage: number
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
    const [isEditing, setIsEditing] = useState(false);
    const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
    const [stockToAdd, setStockToAdd] = useState(0);

    const { data: editedProduct, setData: setEditedProduct, put, processing, errors } = useForm({
        name: product.name,
        description: product.description || "",
        stock: product.stock,
        price: product.price,
    });

    const handleEditClick = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedProduct({
            name: product.name,
            description: product.description || "",
            stock: product.stock,
            price: product.price,
        });
    };

    const handleSave = async () => {
    if (editedProduct.price < 0) {
        Swal.fire({
            title: "Precio inválido",
            text: "El precio no puede ser negativo.",
            icon: "warning",
            confirmButtonColor: COLORS.primary
        });
        return;
    }

    try {
        await router.put(route('products.update', { product: product.id }), {
            name: editedProduct.name,
            description: editedProduct.description,
            stock: editedProduct.stock,
            price: editedProduct.price,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Producto actualizado correctamente",
                    icon: "success",
                    confirmButtonColor: COLORS.primary,
                    timer: 2000
                });
                setIsEditing(false);
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Error",
                    text: errors.message || "Error al actualizar el producto",
                    icon: "error",
                    confirmButtonColor: COLORS.primary
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Error de conexión",
            icon: "error",
            confirmButtonColor: COLORS.primary
        });
    }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "stock") {
        setEditedProduct(name, parseInt(value) || 0);
    } else if (name === "price") {
        setEditedProduct(name, parseFloat(value) || 0);
    } else {
        setEditedProduct(name, value);
    }
};


    const handleOpenAddStockModal = () => {
        setStockToAdd(0);
        setIsAddStockModalOpen(true);
    };

    const handleCloseAddStockModal = () => {
        setIsAddStockModalOpen(false);
    };

    const handleConfirmAddStock = () => {
        const newStock = editedProduct.stock + stockToAdd;
        setEditedProduct("stock", newStock);
        setIsAddStockModalOpen(false);

        Swal.fire({
            title: "¡Stock actualizado!",
            text: `Se añadieron ${stockToAdd} unidades al inventario.`,
            icon: "success",
            confirmButtonColor: COLORS.primary,
            timer: 2000
        });
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="text-2xl font-bold text-[#E17100]">Detalles del Producto</h2>}>
            <Head title={`Detalles de ${product.name}`} />

            <div>
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="bg-white border border-[#E17100]/30 rounded-2xl p-8 shadow-lg relative">
                        <button
                            onClick={handleEditClick}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E17100]/10 transition-colors"
                            title="Editar producto"
                        >
                            <Edit className="w-5 h-5 text-[#E17100]" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <img
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-64 h-64 rounded-lg object-cover border border-[#E17100]/20"
                                />
                            </div>
                            <div className="w-full md:w-2/3">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedProduct.name}
                                            onChange={handleInputChange}
                                            maxLength={30}
                                            className="text-3xl font-bold mb-1 text-[#E17100] w-full p-2 border border-[#E17100]/30 rounded"
                                        />
                                        <p className="text-sm text-gray-500 mb-2">{editedProduct.name.length}/30 caracteres</p>
                                    </>
                                ) : (
                                    <h1 className="text-3xl font-bold mb-2 text-[#E17100]">{product.name}</h1>
                                )}

                                <div className="flex items-center gap-4 mb-4">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editedProduct.price}
                                                onChange={handleInputChange}
                                                min={0}
                                                step="0.01"
                                                className="text-xl font-semibold text-green-700 border border-[#E17100]/30 p-2 rounded w-32"
                                            />
                                            <span className="text-sm text-gray-600">USD</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-semibold text-green-700">
                                                ${product.final_price ? product.final_price.toFixed(2) : product.price.toFixed(2)}
                                            </span>
                                            {product.discount_percent !== null && product.discount_percent > 0 && (
                                                <>
                                                    <span className="text-sm line-through text-gray-500">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    <span className="bg-[#E17100] text-white px-2 py-1 rounded-full text-xs font-bold">
                                                        -{product.discount_percent}%
                                                    </span>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                {isEditing ? (
                                    <>
                                        <textarea
                                            name="description"
                                            value={editedProduct.description}
                                            onChange={handleInputChange}
                                            maxLength={150}
                                            className="text-gray-700 mb-1 w-full p-2 border border-[#E17100]/30 rounded h-32"
                                        />
                                        <p className="text-sm text-gray-500 mb-6">{editedProduct.description.length}/150 caracteres</p>
                                    </>
                                ) : (
                                    <p className="text-gray-700 mb-6">
                                        {product.description || "No hay descripción disponible."}
                                    </p>
                                )}

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#F3F3DF] border border-[#E17100]/10 p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-3 text-[#E17100]">Información General</h2>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Referencia:</span> {product.num_reference}</p>
                                    <p><span className="font-medium">Categoría:</span> {product.categoria}</p>
                                    <p>
                                        <span className="font-medium">Stock disponible: </span>
                                        {editedProduct.stock} unidades
                                    </p>
                                    {isEditing && (
                                        <button
                                            onClick={handleOpenAddStockModal}
                                            className="mt-2 inline-block bg-[#E17100] text-white text-sm px-4 py-1 rounded hover:bg-[#cc5f00] transition"
                                        >
                                            Añadir Stock +
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#F3F3DF] border border-[#E17100]/10 p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-3 text-[#E17100]">Ubicación en Almacén</h2>
                                <div className="space-y-2">
                                    {product.shelf ? (
                                        <>
                                            <p><span className="font-medium">Estantería:</span> {product.shelf.location}</p>
                                            <p className="flex flex-col">
                                                <span className="font-medium">Uso de capacidad:</span>
                                                <span className="text-sm">
                                                    {product.shelf.total_stock} / {product.shelf.max_capacity} unidades
                                                    {product.shelf.products_count && (
                                                        <span> ({product.shelf.products_count} productos)</span>
                                                    )}
                                                </span>
                                            </p>
                                            <div className="w-full bg-gray-200 rounded h-2 mt-1 overflow-hidden">
                                                <div
                                                    className={`h-full ${product.shelf.capacity_percentage >= 100
                                                        ? 'bg-black'
                                                        : product.shelf.capacity_percentage > 85
                                                            ? 'bg-red-500'
                                                            : product.shelf.capacity_percentage > 50
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        }`}
                                                    style={{
                                                        width: `${Math.min(product.shelf.capacity_percentage, 100)}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {product.shelf.capacity_percentage.toFixed(0)}% de capacidad utilizada
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No asignado a estantería</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#F3F3DF] border border-[#E17100]/10 p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-3 text-[#E17100]">Fechas</h2>
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

                        {isEditing && (
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                >
                                    <X size={18} /> Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#E17100] text-white rounded hover:bg-[#cc5f00] transition"
                                >
                                    <Save size={18} /> Guardar cambios
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/manager/stock"
                        className="inline-block bg-[#E17100] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#cc5f00] transition duration-300"
                    >
                        ← Volver a todos los productos
                    </Link>
                </div>

                {isAddStockModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                            <button
                                onClick={handleCloseAddStockModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-lg font-semibold mb-4 text-[#E17100]">Añadir Stock</h2>
                            <input
                                type="number"
                                value={stockToAdd}
                                onChange={(e) => setStockToAdd(parseInt(e.target.value) || 0)}
                                className="w-full border border-[#E17100]/30 p-2 rounded mb-4"
                                min="0"
                                placeholder="Cantidad a añadir"
                            />
                            <button
                                onClick={handleConfirmAddStock}
                                className="w-full bg-[#E17100] text-white py-2 rounded hover:bg-[#cc5f00] transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default ShowProduct;
