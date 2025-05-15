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
import UserSection from "./adminSections/UserSection"
import ShelfSection from "./adminSections/shelfSection"
import ProductSection from "./adminSections/productSection"

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
    const [productsPerPage, setProductsPerPage] = useState(5)
    const [totalProducts, setTotalProducts] = useState(0)
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
            router.delete(`/admin/shelves/${shelfId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Eliminar del frontend directamente
                    setShelves(prev => prev.filter(s => s.id !== shelfId));
                    setTotalShelves(prev => prev - 1);

                    Swal.fire({
                        title: '¡Borrado!',
                        text: 'La estantería ha sido eliminada.',
                        icon: 'success',
                        showConfirmButton: false,
                        background: styles.light,
                        confirmButtonColor: styles.primary,
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
            <div  >
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

                        <UserSection
                            styles={styles}
                            users={users}
                            setUsers={setUsers}
                            loading={loading.users}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            perPage={perPage}
                            totalUsers={totalUsers}
                        />



                        {/* Shelves Section Header */}
                        <ShelfSection
                            styles={styles}
                            shelves={shelves}
                            loading={loading.shelves}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                            shelvesPage={shelvesPage}
                            setShelvesPage={setShelvesPage}
                            shelvesTotalPages={shelvesTotalPages}
                            shelvesPerPage={shelvesPerPage}
                            totalShelves={totalShelves}
                            handleDeleteShelf={handleDeleteShelf}
                        />


                        <ProductSection
                            styles={styles}
                            products={products}
                            loading={loading.products}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                            productsPage={productsPage}
                            setProductsPage={setProductsPage}
                            productsTotalPages={productsTotalPages}
                            productsPerPage={productsPerPage}
                            totalProducts={totalProducts}
                            allShelvesForProducts={allShelvesForProducts}
                            handleDeleteProduct={handleDeleteProduct}
                        />

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
                }}

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
