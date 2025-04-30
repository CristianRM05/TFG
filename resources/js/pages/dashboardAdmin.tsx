import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import type { BreadcrumbItem, User } from '@/types';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';

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
        roles: RoleOption[];
    }>().props;
    const [categorias, setCategorias] = useState<Categoria[]>([]);

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
                // Datos de prueba como fallback
                setUsers([
                    {
                        id: 1,
                        name: "Admin",
                        email: "admin@test.com",
                        role: "Admin"
                    }
                ]);
                setTotalPages(1);
            }
        };

        fetchUsers();
    }, [currentPage]); // Se ejecuta cuando cambia currentPage


    useEffect(() => {
        fetch('/api/products/categorias')
            .then(response => response.json())
            .then(data => setCategorias(data))
            .catch(error => console.error('Error al obtener categorías:', error));
    }, []);

    if (!auth?.user) return <div>Cargando o no autenticado</div>;
    const uploadToImgBB = async (file: File): Promise<string | null> => {
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '6512c2d5a06b884ad74a74727c6e6332';

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            return result.data?.url || null;
        } catch (error) {
            console.error('❌ Error al subir la imagen a ImgBB:', error);
            return null;
        }
    };

    const user = auth.user;
    const [openProductModal, setOpenProductModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);

    const {
        data: productData,
        setData: setProductData,
        post: postProduct,
        processing: processingProduct,
        errors: productErrors,
        reset: resetProduct,
    } = useForm<ProductForm>({
        name: '',
        description: '',
        num_reference: '',
        stock: '',
        categoria: '',
        price: '',
        image_url: "",
    });

    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const price = parseFloat(productData.price);
        const stock = parseInt(productData.stock);

        if (price < 0 || stock < 0) {
            alert('El precio y el stock no pueden ser negativos.');
            return;
        }

        let imageUrl = '';
        if (productData.image_url instanceof File) {
            const uploadedUrl = await uploadToImgBB(productData.image_url);
            if (!uploadedUrl) {
                alert('No se pudo subir la imagen a ImgBB.');
                return;
            }
            imageUrl = uploadedUrl;
        } else if (typeof productData.image_url === 'string') {
            imageUrl = productData.image_url;
        }

        const formData = {
            ...productData,
            image_url: imageUrl,
            price: price,
            stock: stock,
            categoria: productData.categoria || null,
        };

        postProduct('/admin/products', {
            data: formData,
            onSuccess: () => {
                alert('Producto e inventario creados con éxito');
                resetProduct();
                setOpenProductModal(false);
            },
            onError: (errors) => {
                console.error('Error al crear producto:', errors);
                alert('Hubo un error al crear el producto');
            },
            forceFormData: false,
        });
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset
    } = useForm<RegisterForm>({
        name: '',
        last_name: '',
        dni: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        role: '',
        photograph: null,
        license: '',
        driver_license: '',
        license_expiration_date: '',
    });

    function validarDNI(dni: string): boolean {
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const dniRegex = /^\d{8}[A-Z]$/;
        if (!dniRegex.test(dni)) return false;

        const numero = parseInt(dni.substring(0, 8), 10);
        const letra = dni.charAt(8);
        return letras.charAt(numero % 23) === letra;
    }

    function validarTelefono(telefono: string): boolean {
        return /^(6|7|9)\d{8}$/.test(telefono);
    }

    const submitUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarDNI(data.dni)) {
            alert('❌ DNI no válido. Debe tener 8 cifras seguidas de una letra correcta.');
            return;
        }

        if (!validarTelefono(data.phone)) {
            alert('❌ Teléfono no válido. Debe tener 9 cifras y comenzar por 6, 7 o 9.');
            return;
        }

        post('/admin/users', {
            onSuccess: () => {
                reset();
                setOpenUserModal(false);
                alert('Usuario creado con éxito');
            },
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            <div className="p-4 space-y-10 max-w-5xl mx-auto">

                <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">

                    <h2 className="text-2xl font-bold mb-4">Bienvenido, {user.name} {user.last_name}</h2>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p><strong>Rol:</strong> {user.role}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button onClick={() => setOpenUserModal(true)}>➕ Crear empleado</Button>
                        <Button onClick={() => setOpenProductModal(true)}>📦 Crear producto</Button>
                    </div>
                </section>
                <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700 mt-6">
                    <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DNI</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {user.photograph && (
                                                        <img
                                                            src={user.photograph}
                                                            alt={`${user.name} ${user.last_name}`}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {user.name} {user.last_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.dni}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                        user.role === 'Manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                        onClick={() => {/* Lógica para editar */ }}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                        onClick={() => {/* Lógica para eliminar */ }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Componente de Paginación */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-600">
                                Mostrando {(currentPage - 1) * perPage + 1}-
                                {Math.min(currentPage * perPage, totalUsers)} de {totalUsers} usuarios
                            </div>

                            <div className="flex gap-1">
                                {/* Botón Anterior */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                >
                                    &larr; Anterior
                                </button>

                                {/* Números de página */}
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
                                            className={`w-10 h-10 rounded-md ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border hover:bg-gray-100'
                                                } transition-colors`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                >
                                    Siguiente &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal Crear Empleado */}
            <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-screen">
                    <Dialog.Title className="text-xl font-bold mb-4">Registrar nuevo empleado</Dialog.Title>
                    <form onSubmit={submitUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 text-lg font-medium text-gray-600">Datos personales</div>
                        <div><Label htmlFor="name">Nombre</Label><Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} /><InputError message={errors.name} /></div>
                        <div><Label htmlFor="last_name">Apellido</Label><Input id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} /><InputError message={errors.last_name} /></div>
                        <div><Label htmlFor="dni">DNI</Label><Input id="dni" value={data.dni} onChange={e => setData('dni', e.target.value)} /><InputError message={errors.dni} /></div>
                        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} /><InputError message={errors.email} /></div>
                        <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} /><InputError message={errors.phone} /></div>
                        <div><Label htmlFor="address">Dirección</Label><Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} /><InputError message={errors.address} /></div>
                        <div className="col-span-2">
                            <Label htmlFor="role">Rol</Label>
                            <select id="role" value={data.role} onChange={e => setData('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm">
                                <option value="">Seleccionar rol</option>
                                {roles.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
                            </select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="col-span-2"><Label htmlFor="photograph">Fotografía</Label><Input type="file" id="photograph" accept="image/*" onChange={e => setData('photograph', e.target.files?.[0] ?? null)} /><InputError message={errors.photograph} /></div>
                        {data.role === 'Repartidor' && (
                            <>
                                <div className="col-span-2 text-lg font-medium text-gray-600 pt-4">Datos de conducción</div>
                                <div><Label htmlFor="license">Licencia</Label><Input id="license" value={data.license} onChange={e => setData('license', e.target.value)} /><InputError message={errors.license} /></div>
                                <div><Label htmlFor="driver_license">Carnet de conducir</Label><Input id="driver_license" value={data.driver_license} onChange={e => setData('driver_license', e.target.value)} /><InputError message={errors.driver_license} /></div>
                                <div><Label htmlFor="license_expiration_date">Vencimiento de licencia</Label><Input id="license_expiration_date" type="date" value={data.license_expiration_date} onChange={e => setData('license_expiration_date', e.target.value)} /><InputError message={errors.license_expiration_date} /></div>
                            </>
                        )}
                        <div className="col-span-2 flex justify-end mt-6">
                            <Button type="button" variant="ghost" onClick={() => setOpenUserModal(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processing}>Crear empleado</Button>
                        </div>
                    </form>
                </Dialog.Panel>
            </Dialog>

            {/* Modal Crear Producto */}
            <Dialog open={openProductModal} onClose={() => setOpenProductModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">

                <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg">

                    <Dialog.Title className="text-xl font-bold mb-4">Registrar nuevo producto</Dialog.Title>

                    <form onSubmit={submitProduct} className="space-y-4">

                        <div><Label htmlFor="name">Nombre</Label><Input id="name" value={productData.name} onChange={e => setProductData('name', e.target.value)} /><InputError message={productErrors.name} /></div>

                        <div><Label htmlFor="description">Descripción</Label><Input id="description" value={productData.description} onChange={e => setProductData('description', e.target.value)} /><InputError message={productErrors.description} /></div>

                        <div><Label htmlFor="num_reference">Referencia</Label><Input id="num_reference" value={productData.num_reference} onChange={e => setProductData('num_reference', e.target.value)} /><InputError message={productErrors.num_reference} /></div>

                        <div><Label htmlFor="stock">Stock</Label><Input id="stock" type="number" step="1" min="0" value={productData.stock} onChange={e => setProductData('stock', e.target.value)} /><InputError message={productErrors.stock} /></div>

                        <div>
                            <Label htmlFor="categoria">Categoría</Label>
                            <select
                                id="categoria"
                                value={productData.categoria || ''}
                                onChange={e => setProductData('categoria', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map(c => (
                                    <option key={c.value} value={c.value}>
                                        {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                                    </option>
                                ))}

                            </select>
                            <InputError message={productErrors.categoria} />
                        </div>

                        <div><Label htmlFor="price">Precio (€)</Label><Input id="price" type="number" step="0.01" min="0" value={productData.price} onChange={e => setProductData('price', e.target.value)} /><InputError message={productErrors.price} /></div>

                        <div>
                            <Label htmlFor="image_url">Fotografía</Label>
                            <Input
                                id="image_url"
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const uploadedUrl = await uploadToImgBB(file);
                                        if (!uploadedUrl) {
                                            alert('No se pudo subir la imagen a ImgBB.');
                                            return;
                                        }
                                        setProductData('image_url', uploadedUrl);
                                    }
                                }}
                            />
                            <InputError message={productErrors.image_url} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpenProductModal(false)}>Cancelar</Button>
                            <Button type="submit" disabled={processingProduct}>Crear producto</Button>

                        </div>

                    </form>
                </Dialog.Panel>
            </Dialog>
        </AppLayout>
    );
}
