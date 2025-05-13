"use client"

import type React from "react"
import { Head, useForm, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import type { BreadcrumbItem, User, Shelf } from "@/types"
import Swal from "sweetalert2"
import ProductModal from "./product/create"
import ShelfModal from "./shelves/create"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Package, Package2, Trash2, Users } from "lucide-react"

// Interfaz para Categoria que coincide con la esperada por ProductModal
interface CategoriaWithValue {
    name: string
    value: string
}

// Definir la interfaz para Product que se ajuste a nuestro uso específico
interface ExtendedProduct {
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
    final_price?: number
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Admin Dashboard",
        href: "/admin/dashboard",
    },
]

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([])
    // Para estanterías
    const [shelves, setShelves] = useState<any[]>([]);
    const [shelvesPage, setShelvesPage] = useState(1)
    const [shelvesTotalPages, setShelvesTotalPages] = useState(1)
    const [shelvesPerPage, setShelvesPerPage] = useState(5)
    const [totalShelves, setTotalShelves] = useState(0)

    // Para productos
    const [productsPage, setProductsPage] = useState(1)
    const [productsTotalPages, setProductsTotalPages] = useState(1)
    const [productsPerPage, setProductsPerPage] = useState(10)
    const [totalProducts, setTotalProducts] = useState(0)
    // Obtén TODAS las props necesarias en un solo hook
    const { auth, shelves: shelvesFromProps, roles, products: productsFromProps } = usePage<{
        auth: { user: User | null };
    shelves: Array<{
        id: number;
        code: string;
        location: string;
        max_capacity: number;
        total_stock: number;
        products_count: number;
        capacity_percentage: number;
    }>;
    roles: Array<{
        value: string;
        label: string;
    }>;
    products: ExtendedProduct[];
}>().props;
    const allShelvesForProducts = shelvesFromProps || [];

    // Verificación
    console.log('Datos completos:', { auth, shelves, roles });
    const [categorias, setCategorias] = useState<CategoriaWithValue[]>([])
    const [openProductModal, setOpenProductModal] = useState(false)
    const [openShelfModal, setOpenShelfModal] = useState(false)
    const {
        data: productData,
        setData: setProductData,
        post,
        processing: processingProduct,
        errors: productErrors,
        reset: resetProduct,
    } = useForm({
        name: "",
        description: "",
        num_reference: "",
        stock: "",
        categoria: "",
        price: "",
        image_url: "",
    })
    const {
        data: shelfData,
        setData: setShelfData,
        post: postShelf,
        processing: processingShelf,
        errors: shelfErrors,
        reset: resetShelf,
        clearErrors,
    } = useForm({
        code: "",
        location: "",
        max_capacity: "",
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [totalUsers, setTotalUsers] = useState(0)
    const [products, setProducts] = useState<ExtendedProduct[]>([])
    const [openSection, setOpenSection] = useState<string | null>("null") // 'users', 'shelves', 'products' o null
    const [loading, setLoading] = useState({
        users: false,
        shelves: false,
        products: false,
        categorias: false,
    })

    // Función para mostrar mensajes de error
    const showError = (message: string) => {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            confirmButtonColor: styles.secondary,
        })
    }

    // Cargar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading((prev) => ({ ...prev, users: true }))
            try {
                const response = await fetch(`/admin/users?page=${currentPage}`)
                if (!response.ok) throw new Error("Error al cargar usuarios")
                const data = await response.json()
                if (data.success) {
                    setUsers(data.users)
                    setTotalPages(data.pagination.last_page)
                    setPerPage(data.pagination.per_page)
                    setTotalUsers(data.pagination.total)
                } else {
                    throw new Error("Error en la respuesta del servidor")
                }
            } catch (error) {
                console.error("Error:", error)
                setTotalPages(1)
                showError("No se pudieron cargar los usuarios. Por favor, intenta de nuevo más tarde.")
            } finally {
                setLoading((prev) => ({ ...prev, users: false }))
            }
        }
        fetchUsers()
    }, [currentPage])

    // Cargar , estanterías y productos
    useEffect(() => {
        // Estanterías paginadas
        const fetchShelves = async () => {
            setLoading((prev) => ({ ...prev, shelves: true }));
            try {
                const response = await fetch(`/admin/shelves?page=${shelvesPage}&per_page=${shelvesPerPage}`);
                if (!response.ok) throw new Error("Error al cargar estanterías");
                const data = await response.json();

                if (data.success) {
                    const shelvesWithCalculations = data.shelves.map((shelf: any) => ({
                        ...shelf,
                        total_stock: shelf.products?.reduce((sum: number, p: any) => sum + (p.stock || 0), 0) || 0,
                        products_count: shelf.products?.length || 0,
                        capacity_percentage: shelf.max_capacity > 0
                            ? Math.min(100, ((shelf.products?.reduce((sum: number, p: any) => sum + (p.stock || 0), 0) || 0) / shelf.max_capacity) * 100)
                            : 0
                    }));

                    setShelves(shelvesWithCalculations);
                    setTotalShelves(data.pagination.total);
                    setShelvesTotalPages(data.pagination.last_page);
                    setShelvesPerPage(data.pagination.per_page);
                }
            } catch (error) {
                console.error("Error al cargar estanterías:", error);
                // ...datos de ejemplo
            } finally {
                setLoading((prev) => ({ ...prev, shelves: false }));
            }
        };

        // Productos paginados
        const fetchProducts = async () => {
            setLoading((prev) => ({ ...prev, products: true }));
            try {
                const response = await fetch(`/admin/products?page=${productsPage}&per_page=${productsPerPage}`);
                if (!response.ok) throw new Error("Error al cargar productos");
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                    setTotalProducts(data.pagination.total);
                    setProductsTotalPages(data.pagination.last_page);
                    setProductsPerPage(data.pagination.per_page);
                }
            } catch (error) {
                console.error("Error al cargar productos:", error);
                // ...datos de ejemplo
            } finally {
                setLoading((prev) => ({ ...prev, products: false }));
            }
        };

        fetchShelves();
        fetchProducts();
    }, [shelvesPage, shelvesPerPage, productsPage, productsPerPage]);

    useEffect(() => {
        if (productsFromProps) {
            setProducts(productsFromProps);
            setTotalProducts(productsFromProps.length);
        }
    }, [productsFromProps]);

    if (!auth?.user) return <div>Cargando o no autenticado</div>
    const user = auth.user
    // Funciones para calcular la capacidad
   /* const getShelfCapacityPercentage = (shelf: Shelf) => {
        if (!shelf.max_capacity || shelf.max_capacity === 0) return 0;
        const currentStock = shelf.total_stock || 0;
        return Math.min(100, Math.round((currentStock / shelf.max_capacity) * 100));
    };

    const getShelfCapacityInfo = (shelf: Shelf) => {
        return `${shelf.total_stock || 0} / ${shelf.max_capacity} unidades`;
    };*/

    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        post("/admin/products", {
            preserveScroll: true,
            onSuccess: () => {
                resetProduct()
                setOpenProductModal(false)
                // Recargar la lista de productos
                fetch("/admin/products")
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            setProducts(data.products)
                            setTotalProducts(data.total || data.products.length)
                        }
                    })
                    .catch((error) => console.error("Error al recargar productos:", error))
            },
        })
    }

    const submitShelf = (e: React.FormEvent) => {
        e.preventDefault()
        postShelf("/admin/shelves", {
            preserveScroll: true,
            onSuccess: () => {
                resetShelf()
                setOpenShelfModal(false)
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Estantería creada con éxito",
                    showConfirmButton: false,
                    icon: "success",
                    confirmButtonColor: styles.primary,
                    timer: 3000,
                })

                // Recargar la lista de estanterías
                fetch("/admin/shelves")
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            setShelves(data.shelves)
                            setTotalShelves(data.total || data.shelves.length)
                        }
                    })
                    .catch((error) => console.error("Error al recargar estanterías:", error))
            },
            onError: () => {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al crear la estantería",
                    icon: "error",
                    confirmButtonColor: styles.secondary,
                    showConfirmButton: false,
                    timer: 3000,
                })
            },
        })
    }

    const handleDeleteShelf = (shelfId: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: styles.primary, // Marrón principal
            cancelButtonColor: styles.secondary, // Marrón secundario
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
            background: styles.light, // Fondo claro
            customClass: {
                popup: 'shadow-lg', // Sombra similar a tu diseño
                confirmButton: 'hover:opacity-90 transition-opacity' // Efecto hover
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/shelves/${shelfId}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: '¡Borrado!',
                            text: 'La estantería ha sido eliminada.',
                            icon: 'success',
                            showConfirmButton: false,
                            confirmButtonColor: styles.primary, // Marrón principal
                            background: styles.light,
                            timer: 3000
                        });
                        router.reload({ only: ['shelves'] });
                    }
                });
            }
        });
    };

    const handleDeleteProduct = (productId: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: styles.primary,
            cancelButtonColor: styles.secondary,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
            background: styles.light,
            customClass: {
                popup: 'shadow-lg',
                confirmButton: 'hover:opacity-90 transition-opacity'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/products/${productId}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Elimina el producto localmente
                        setProducts((prev) => prev.filter(p => p.id !== productId));
                        setTotalProducts((prev) => prev - 1);

                        Swal.fire({
                            title: '¡Borrado!',
                            text: 'El producto ha sido eliminado.',
                            showConfirmButton: false,
                            icon: 'success',
                            confirmButtonColor: styles.primary,
                            background: styles.light,
                            timer: 2000,
                            customClass: {
                                popup: 'shadow-lg'
                            }
                        });
                    }
                });
            }
        });
    };
    // Custom styles based on the provided color palette
    const styles = {
        primary: "#8F5C0C", // warm brown
        secondary: "#7C5F42", // medium brown
        dark: "#000000", // black
        light: "#F3F3F1", // off-white
    }

    // Componente de carga
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: styles.primary }}></div>
        </div>
    )


    // Debug obligatorio (añade esto justo después)
    console.log('Shelves data in frontend:', shelves);

    return (
        <AppLayout breadcrumbs={breadcrumbs} className="bg-red-100">
            <Head title="Dashboard Admin" />
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: styles.light }}>
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome section */}
                    <section
                        className="rounded-2xl p-6 shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`,
                            color: styles.light,
                        }}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Bienvenido, {user.name} {user.last_name}
                                </h1>
                                <div
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                >
                                    <span className="mr-2">•</span> {user.role}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <Button
                                    onClick={() => setOpenShelfModal(true)}
                                    className="flex items-center gap-2 text-md font-medium rounded-xl px-6 py-3 transition-all w-full md:w-auto justify-center"
                                    style={{
                                        backgroundColor: styles.light,
                                        color: styles.primary,
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <Package2 size={20} />
                                    Crear estantería
                                </Button>
                                <Button
                                    onClick={() => setOpenProductModal(true)}
                                    className="flex items-center gap-2 text-md font-medium rounded-xl px-6 py-3 transition-all w-full md:w-auto justify-center"
                                    style={{
                                        backgroundColor: styles.light,
                                        color: styles.primary,
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <Package size={20} />
                                    Crear producto
                                </Button>

                            </div>
                        </div>
                    </section>

                    {/* Dashboard stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            className="rounded-2xl p-6 shadow-md border-l-4 transition-all hover:shadow-lg"
                            style={{
                                backgroundColor: "white",
                                borderLeftColor: styles.primary,
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-700">Total Usuarios</h3>
                                <div className="p-3 rounded-full" style={{ backgroundColor: `${styles.primary}20` }}>
                                    <Users size={20} style={{ color: styles.primary }} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold mt-4" style={{ color: styles.primary }}>
                                {loading.users ? "..." : totalUsers}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Usuarios activos en el sistema</p>
                        </div>

                        <div
                            className="rounded-2xl p-6 shadow-md border-l-4 transition-all hover:shadow-lg"
                            style={{
                                backgroundColor: "white",
                                borderLeftColor: styles.primary,
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-700">Total Estanterías</h3>
                                <div className="p-3 rounded-full" style={{ backgroundColor: `${styles.primary}20` }}>
                                    <Package2 size={20} style={{ color: styles.primary }} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold mt-4" style={{ color: styles.primary }}>
                                {loading.shelves ? "..." : totalShelves}                           </p>
                            <p className="text-sm text-gray-500 mt-2">Estanterías disponibles</p>
                        </div>

                        <div
                            className="rounded-2xl p-6 shadow-md border-l-4 transition-all hover:shadow-lg"
                            style={{
                                backgroundColor: "white",
                                borderLeftColor: styles.primary,
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-700">Total Productos</h3>
                                <div className="p-3 rounded-full" style={{ backgroundColor: `${styles.primary}20` }}>
                                    <Package size={20} style={{ color: styles.primary }} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold mt-4" style={{ color: styles.primary }}>
                                {loading.products ? "..." : totalProducts}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">Productos en inventario</p>
                        </div>
                    </div>

                    {/* Management sections */}
                    <section className="bg-white rounded-2xl shadow-md overflow-hidden">
                        {/* Users Section Header */}
                        <div
                            className="p-6 border-b cursor-pointer"
                            style={{ borderColor: `${styles.secondary}30` }}
                            onClick={() => setOpenSection(openSection === "users" ? null : "users")}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users size={24} style={{ color: styles.primary }} />
                                    <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>
                                        Gestión de Usuarios
                                    </h2>
                                </div>
                                {openSection === "users" ? (
                                    <ChevronUp size={24} style={{ color: styles.primary }} />
                                ) : (
                                    <ChevronDown size={24} style={{ color: styles.primary }} />
                                )}
                            </div>
                        </div>

                        {/* Users Table */}
                        {openSection === "users" && (
                            <div className="overflow-x-auto">
                                {loading.users ? (
                                    <LoadingSpinner />
                                ) : (
                                        <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                            <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                                <tr>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: styles.secondary }}
                                                    >
                                                        Nombre
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: styles.secondary }}
                                                    >
                                                        Email
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: styles.secondary }}
                                                    >
                                                        Teléfono
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: styles.secondary }}
                                                    >
                                                        Rol
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: styles.secondary }}
                                                    >
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                                {users.length > 0 ? (
                                                    users.map((user) => (
                                                        <tr key={user.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {user.avatar ? (
                                                                        <img
                                                                        src={user.avatar || "/placeholder.svg"}
                                                                        alt={`${user.name} ${user.last_name}`}
                                                                        className="h-10 w-10 rounded-full object-cover ring-2"
                                                                        style={{ borderColor: styles.primary }}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium"
                                                                        style={{
                                                                            backgroundColor: `${styles.primary}20`,
                                                                            color: styles.primary,
                                                                        }}
                                                                    >
                                                                        {user.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium" style={{ color: styles.dark }}>
                                                                        {user.name} {user.last_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            user.role === "Admin"
                                                                                ? "#fef9c3" // amarillo claro (bg-yellow-100)
                                                                                : user.role === "Manager"
                                                                                    ? "#dbeafe" // azul claro (bg-blue-100)
                                                                                    : "rgba(0, 128, 0, 0.2)", // verde claro
                                                                        color:
                                                                            user.role === "Admin"
                                                                                ? "#b45309" // amarillo oscuro (text-yellow-700)
                                                                                : user.role === "Manager"
                                                                                    ? "#1d4ed8" // azul fuerte (text-blue-700)
                                                                                    : "green",
                                                                    }}
                                                                >
                                                                    {user.role}
                                                                </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => {
                                                                        Swal.fire({
                                                                            title: `¿Estás seguro de querer ${user.banned_at ? "desbanear" : "banear"} a ${user.name}?`,
                                                                            icon: user.banned_at ? "question" : "warning",
                                                                            showCancelButton: true,
                                                                            confirmButtonColor: styles.primary,
                                                                            cancelButtonColor: styles.secondary,
                                                                            confirmButtonText: user.banned_at ? "Sí, desbanear" : "Sí, banear",
                                                                            cancelButtonText: "Cancelar",
                                                                            background: styles.light,
                                                                            customClass: {
                                                                                popup: 'shadow-lg',
                                                                                confirmButton: 'hover:opacity-90 transition-opacity'
                                                                            }
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                router.patch(
                                                                                    `/admin/users/${user.id}/ban`,
                                                                                    {
                                                                                        banned: !user.banned_at,
                                                                                    },
                                                                                    {
                                                                                        preserveScroll: true,
                                                                                        onSuccess: () => {
                                                                                            setUsers(
                                                                                                users.map((u) =>
                                                                                                    u.id === user.id
                                                                                                        ? { ...u, banned_at: user.banned_at ? null : new Date().toISOString() }
                                                                                                        : u,
                                                                                                ),
                                                                                            )
                                                                                        Swal.fire({
                                                                                            icon: "success",
                                                                                            title: user.banned_at ? "Usuario desbaneado" : "Usuario baneado",
                                                                                            showConfirmButton: false,
                                                                                            timer: 1800,
                                                                                            background: styles.light,
                                                                                            customClass: { popup: 'shadow-lg' }
                                                                                        });
                                                                                    },
                                                                                    onError: () => {
                                                                                        Swal.fire({
                                                                                            icon: "error",
                                                                                            title: "Error en el proceso",
                                                                                            html: `
                                                                                          <div style="text-align:left">
                                                                                            <p>❌ <strong>Fallo al actualizar el estado</strong></p>
                                                                                            <p><small>Error al procesar la solicitud</small></p>
                                                                                          </div>
                                                                                        `,
                                                                                            confirmButtonText: "Entendido",
                                                                                            footer:
                                                                                                '<a href="#" onclick="mostrarDetallesTecnicos()">Ver detalles técnicos</a>',
                                                                                            background: styles.light,
                                                                                            customClass: { popup: 'shadow-lg' }
                                                                                        })
                                                                                    },
                                                                                },
                                                                            )
                                                                        }
                                                                    });
                                                                }}
                                                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                                style={{
                                                                    backgroundColor: user.banned_at ? "rgba(0, 128, 0, 0.15)" : "rgba(220, 38, 38, 0.15)",
                                                                    color: user.banned_at ? "green" : "#dc2626",
                                                                }}
                                                            >
                                                                {user.banned_at ? "Desbanear" : "Banear"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                                            No hay usuarios registrados
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                )}

                                {/* Pagination control */}
                                {totalPages > 1 && (
                                <div className="flex items-center justify-between p-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, totalUsers)} de{" "}
                                        {totalUsers} usuarios
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        {/* Previous button */}
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page =
                                                currentPage <= 3
                                                    ? i + 1
                                                    : currentPage >= totalPages - 2
                                                        ? totalPages - 4 + i
                                                        : currentPage - 2 + i

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 rounded-lg transition-all font-medium ${currentPage === page ? "shadow-md" : ""
                                                        }`}
                                                    style={{
                                                        backgroundColor: currentPage === page ? styles.primary : "transparent",
                                                        color: currentPage === page ? "white" : styles.secondary,
                                                        border: currentPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}

                                        {/* Next button */}
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        )}

                        {/* Shelves Section Header */}
                        <div
                            className="p-6 border-b cursor-pointer"
                            style={{ borderColor: `${styles.secondary}30` }}
                            onClick={() => setOpenSection(openSection === "shelves" ? null : "shelves")}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Package2 size={24} style={{ color: styles.primary }} />
                                    <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>
                                        Gestión de Estanterías
                                    </h2>
                                </div>
                                {openSection === "shelves" ? (
                                    <ChevronUp size={24} style={{ color: styles.primary }} />
                                ) : (
                                    <ChevronDown size={24} style={{ color: styles.primary }} />
                                )}
                            </div>
                        </div>

                        {/* Shelves Table */}
                        {openSection === "shelves" && (
                            <div className="overflow-x-auto">
                                {loading.shelves ? (
                                    <LoadingSpinner />
                                ) : (
                                    <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                        <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                            <tr>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Código
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Ubicación
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Capacidad Máxima
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Fecha Creación
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                            {shelves.length > 0 ? (
                                                shelves.map((shelf) => (
                                                    <tr key={shelf.id} className="hover:bg-gray-50">
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                            style={{ color: styles.dark }}
                                                        >
                                                            {shelf.code}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shelf.location}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-full mr-2">
                                                                    <div className="relative pt-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <span className="text-xs font-semibold inline-block text-gray-600">
                                                                                    {shelf.total_stock} / {shelf.max_capacity} unidades
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs font-semibold inline-block text-gray-600">
                                                                                    {shelf.products_count} productos
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                            <div
                                                                                style={{
                                                                                    width: `${shelf.capacity_percentage}%`
                                                                                }}
                                                                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                                                                                    ${shelf.capacity_percentage >= 100
                                                                                        ? 'bg-black'
                                                                                        : shelf.capacity_percentage >= 99
                                                                                            ? 'bg-red-500'
                                                                                            : shelf.capacity_percentage > 85
                                                                                                ? 'bg-red-500'
                                                                                                : shelf.capacity_percentage > 50
                                                                                                    ? 'bg-yellow-500'
                                                                                                    : 'bg-green-500'
                                                                                    }`
                                                                                }
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {shelf.created_at ? new Date(shelf.created_at).toLocaleDateString() : "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDeleteShelf(shelf.id)}
                                                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                                                style={{
                                                                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                                                                    color: "#dc2626",
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 inline mr-1" /> Borrar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                                        No hay estanterías registradas
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        </table>

                                )}
                                {shelvesTotalPages > 1 && (
                                <div className="flex items-center justify-between p-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {(shelvesPage - 1) * shelvesPerPage + 1}-{Math.min(shelvesPage * shelvesPerPage, totalShelves)} de {totalShelves} estanterías
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            onClick={() => setShelvesPage((p) => Math.max(1, p - 1))}
                                            disabled={shelvesPage === 1}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        {Array.from({ length: Math.min(5, shelvesTotalPages) }, (_, i) => {
                                            const page =
                                                shelvesPage <= 3
                                                    ? i + 1
                                                    : shelvesPage >= shelvesTotalPages - 2
                                                        ? shelvesTotalPages - 4 + i
                                                        : shelvesPage - 2 + i

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setShelvesPage(page)}
                                                    className={`w-10 h-10 rounded-lg transition-all font-medium ${shelvesPage === page ? "shadow-md" : ""}`}
                                                    style={{
                                                        backgroundColor: shelvesPage === page ? styles.primary : "transparent",
                                                        color: shelvesPage === page ? "white" : styles.secondary,
                                                        border: shelvesPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}
                                        <button
                                            onClick={() => setShelvesPage((p) => Math.min(shelvesTotalPages, p + 1))}
                                            disabled={shelvesPage === shelvesTotalPages}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>

                        )}

                        {/* Products Section Header */}
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

                        {/* Products Table */}
                        {openSection === "products" && (
                            <div className="overflow-x-auto">
                                {loading.products ? (
                                    <LoadingSpinner />
                                ) : (
                                    <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                        <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                            <tr>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Imagen
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Nombre
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Referencia
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Stock
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Precio
                                                    </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: styles.secondary }}>Descuento (%)</th>
                                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: styles.secondary }}>Precio Final</th>

                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Estantería
                                                </th>
                                                <th
                                                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                                    style={{ color: styles.secondary }}
                                                >
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={product.image_url || "/placeholder.svg"}
                                                                    alt={product.name}
                                                                    className="h-12 w-12 object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-md flex items-center justify-center bg-gray-100">
                                                                    <Package size={20} style={{ color: styles.secondary }} />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                                            style={{ color: styles.dark }}
                                                        >
                                                            {product.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {product.num_reference}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.price}€</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {typeof product.discount_percent === "number" ? product.discount_percent + "%" : "0%"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {typeof product.discount_percent === "number"
                                                                ? ((product.price || 0) * (1 - (product.discount_percent || 0) / 100)).toFixed(2) + "€"
                                                                : (product.price || 0).toFixed(2) + "€"}
                                                        </td>


                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {product.shelf_id ? (
                                                                allShelvesForProducts.find((shelf) => shelf.id === product.shelf_id)
                                                                    ? allShelvesForProducts.find((shelf) => shelf.id === product.shelf_id)!.code
                                                                    : <span className="text-gray-400">ID: {product.shelf_id}</span>
                                                            ) : (
                                                                <span className="text-gray-400">Sin asignar</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                className="px-3 py-1 rounded-md text-sm font-medium ml-2"
                                                                style={{
                                                                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                                                                    color: "#dc2626",
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3 inline mr-1" /> Borrar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                                        No hay productos registrados
                                                    </td>
                                                        </tr>

                                            )}
                                        </tbody>
                                    </table>
                                )}
                                {productsTotalPages > 1 && (
                                <div className="flex items-center justify-between p-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {(productsPage - 1) * productsPerPage + 1}-{Math.min(productsPage * productsPerPage, totalProducts)} de {totalProducts} productos
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                                            disabled={productsPage === 1}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        {Array.from({ length: Math.min(5, productsTotalPages) }, (_, i) => {
                                            const page =
                                                productsPage <= 3
                                                    ? i + 1
                                                    : productsPage >= productsTotalPages - 2
                                                        ? productsTotalPages - 4 + i
                                                        : productsPage - 2 + i

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setProductsPage(page)}
                                                    className={`w-10 h-10 rounded-lg transition-all font-medium ${productsPage === page ? "shadow-md" : ""}`}
                                                    style={{
                                                        backgroundColor: productsPage === page ? styles.primary : "transparent",
                                                        color: productsPage === page ? "white" : styles.secondary,
                                                        border: productsPage === page ? "none" : `1px solid ${styles.secondary}30`,
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}
                                        <button
                                            onClick={() => setProductsPage((p) => Math.min(productsTotalPages, p + 1))}
                                            disabled={productsPage === productsTotalPages}
                                            className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                            style={{ color: styles.secondary }}
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <ProductModal
                open={openProductModal}
                onClose={() => setOpenProductModal(false)}
                categorias={categorias}
                productData={productData}
                setProductData={setProductData}
                submitProduct={submitProduct}
                productErrors={productErrors}
                processingProduct={processingProduct} resetProduct={function (): void {
                    throw new Error("Function not implemented.")
                } }

            />

            <ShelfModal
                open={openShelfModal}
                onClose={() => {
                    setOpenShelfModal(false)
                    resetShelf()
                    clearErrors()
                }}
                shelfData={shelfData}
                setShelfData={setShelfData}
                submitShelf={submitShelf}
                shelfErrors={shelfErrors}
                processingShelf={processingShelf}
                clearErrors={clearErrors}
            />
        </AppLayout>
    )
}
