import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import type { BreadcrumbItem, User } from '@/types';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Swal from 'sweetalert2';
import ProductModal from './product/create';
import { Package, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const { auth, roles } = usePage<{
        auth: { user: User | null };
    }>().props;
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [openProductModal, setOpenProductModal] = useState(false);

    const {
        data: productData,
        setData: setProductData,
        post,
        processing: processingProduct,
        errors: productErrors,
        reset: resetProduct,
    } = useForm({
        name: '',
        description: '',
        num_reference: '',
        stock: '',
        categoria: '',
        price: '',
        image_url: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/admin/users?page=${currentPage}`);
                if (!response.ok) throw new Error('Error al cargar usuarios');
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                    setTotalPages(data.pagination.last_page);
                    setPerPage(data.pagination.per_page);
                    setTotalUsers(data.pagination.total);
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error:', error);
                setTotalPages(1);
            }
        };
        fetchUsers();
    }, [currentPage]);

    if (!auth?.user) return <div>Cargando o no autenticado</div>;
    const user = auth.user;

    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products', {
            preserveScroll: true,
            onSuccess: () => {
                resetProduct();
                setOpenProductModal(false);
            },
        });
    };

    // Custom styles based on the provided color palette
    const styles = {
        primary: '#8F5C0C',    // warm brown
        secondary: '#7C5F42',  // medium brown
        dark: '#000000',       // black
        light: '#F3F3F1',      // off-white
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} className='bg-red-100'>
            <Head title="Dashboard Admin" />
            <div
                className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: styles.light }}
            >
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
                                <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.name} {user.last_name}</h1>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <span className="mr-2">•</span> {user.role}
                                </div>
                            </div>
                            <Button
                                onClick={() => setOpenProductModal(true)}
                                className="flex items-center gap-2 text-md font-medium rounded-xl px-6 py-3 transition-all"
                                style={{
                                    backgroundColor: styles.light,
                                    color: styles.primary,
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Package size={20} />
                                Crear producto
                            </Button>
                        </div>
                    </section>

                    {/* Dashboard stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div
                            className="rounded-2xl p-6 shadow-md border-l-4 transition-all hover:shadow-lg"
                            style={{
                                backgroundColor: 'white',
                                borderLeftColor: styles.primary
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-700">Total Usuarios</h3>
                                <div
                                    className="p-3 rounded-full"
                                    style={{ backgroundColor: `${styles.primary}20` }}
                                >
                                    <Users size={20} style={{ color: styles.primary }} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold mt-4" style={{ color: styles.primary }}>{totalUsers}</p>
                            <p className="text-sm text-gray-500 mt-2">Usuarios activos en el sistema</p>
                        </div>

                        {/* You can add more stats cards here */}
                    </div>

                    {/* User management section */}
                    <section className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="p-6 border-b"
                            style={{ borderColor: `${styles.secondary}30` }}>
                            <div className="flex items-center gap-3">
                                <Users size={24} style={{ color: styles.primary }} />
                                <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>
                                    Gestión de Usuarios
                                </h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            style={{ color: styles.secondary }}>
                                            Nombre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            style={{ color: styles.secondary }}>
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            style={{ color: styles.secondary }}>
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            style={{ color: styles.secondary }}>
                                            Rol
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                                            style={{ color: styles.secondary }}>
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={`${user.name} ${user.last_name}`}
                                                                className="h-10 w-10 rounded-full object-cover ring-2"
                                                                style={{ borderColor: styles.primary }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium"
                                                                style={{
                                                                    backgroundColor: `${styles.primary}20`,
                                                                    color: styles.primary
                                                                }}
                                                            >
                                                                {user.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium"
                                                                style={{ color: styles.dark }}>
                                                                {user.name} {user.last_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.phone}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                user.role === 'Admin' ? `${styles.primary}20` :
                                                                user.role === 'Manager' ? `${styles.secondary}20` :
                                                                'rgba(0, 128, 0, 0.2)',
                                                            color:
                                                                user.role === 'Admin' ? styles.primary :
                                                                user.role === 'Manager' ? styles.secondary :
                                                                'green'
                                                        }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`¿Estás seguro de querer ${user.banned_at ? 'desbanear' : 'banear'} a ${user.name}?`)) {
                                                                router.patch(`/admin/users/${user.id}/ban`, {
                                                                    banned: !user.banned_at,
                                                                }, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => {
                                                                        setUsers(users.map(u =>
                                                                            u.id === user.id
                                                                                ? { ...u, banned_at: user.banned_at ? null : new Date().toISOString() }
                                                                                : u
                                                                        ));
                                                                    },
                                                                    onError: () => {
                                                                        Swal.fire({
                                                                            icon: 'error',
                                                                            title: 'Error en el proceso',
                                                                            html: `
                                                                            <div style="text-align:left">
                                                                                <p>❌ <strong>Fallo al actualizar el estado</strong></p>
                                                                                <p><small>Error al procesar la solicitud</small></p>
                                                                            </div>
                                                                            `,
                                                                            confirmButtonText: 'Entendido',
                                                                            footer: '<a href="#" onclick="mostrarDetallesTecnicos()">Ver detalles técnicos</a>'
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                        style={{
                                                            backgroundColor: user.banned_at
                                                                ? 'rgba(0, 128, 0, 0.15)'
                                                                : 'rgba(220, 38, 38, 0.15)',
                                                            color: user.banned_at
                                                                ? 'green'
                                                                : '#dc2626'
                                                        }}
                                                    >
                                                        {user.banned_at ? 'Desbanear' : 'Banear'}
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

                            {/* Pagination control */}
                            <div className="flex items-center justify-between p-6">
                                <div className="text-sm text-gray-600">
                                    Mostrando {(currentPage - 1) * perPage + 1}-
                                    {Math.min(currentPage * perPage, totalUsers)} de {totalUsers} usuarios
                                </div>

                                <div className="flex gap-2 items-center">
                                    {/* Previous button */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                        style={{ color: styles.secondary }}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = currentPage <= 3
                                            ? i + 1
                                            : currentPage >= totalPages - 2
                                                ? totalPages - 4 + i
                                                : currentPage - 2 + i;

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg transition-all font-medium ${
                                                    currentPage === page ? 'shadow-md' : ''
                                                }`}
                                                style={{
                                                    backgroundColor: currentPage === page
                                                        ? styles.primary
                                                        : 'transparent',
                                                    color: currentPage === page
                                                        ? 'white'
                                                        : styles.secondary,
                                                    border: currentPage === page
                                                        ? 'none'
                                                        : `1px solid ${styles.secondary}30`
                                                }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    {/* Next button */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                        style={{ color: styles.secondary }}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
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
                processingProduct={processingProduct}
            />
        </AppLayout>
    );
}