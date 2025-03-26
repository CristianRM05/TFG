import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

type RoleOption = {
    value: string;
    label: string;
};

type User = {
    name: string;
    last_name: string;
    number_employ: string;
    dni: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: string;
    license: string | null;
    driver_license: string | null;
    license_expiration_date: string | null;
    photograph?: string | null;
};

type RegisterForm = {
    name: string;
    last_name: string;
    dni: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
    role: string;
    photograph: File | null;
    license: string;
    driver_license: string;
    license_expiration_date: string;
};

export default function AdminDashboard() {
    const { auth, roles } = usePage<{
        auth: { user: User | null };
        roles: RoleOption[];
    }>().props;

    if (!auth?.user) return <div>Cargando o no autenticado</div>;

    const user = auth.user;

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        last_name: '',
        dni: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        role: '',
        departamento_id: '',
        photograph: null,
        license: '',
        driver_license: '',
        license_expiration_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                reset();
                alert('Usuario creado con éxito');
            },
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            <div className="p-4 space-y-10 max-w-5xl mx-auto">
                {/* 🧑 Info Admin */}
                <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">Bienvenido, {user.name} {user.last_name}</h2>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p><strong>Número de empleado:</strong> {user.number_employ}</p>
                            <p><strong>DNI:</strong> {user.dni}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Teléfono:</strong> {user.phone ?? '—'}</p>
                            <p><strong>Dirección:</strong> {user.address ?? '—'}</p>
                        </div>

                        <div className="space-y-1">
                            <p><strong>Rol:</strong> {user.role}</p>
                            <p><strong>Licencia:</strong> {user.license ?? '—'}</p>
                            <p><strong>Carnet de conducir:</strong> {user.driver_license ?? '—'}</p>
                            <p><strong>Vencimiento licencia:</strong> {user.license_expiration_date ?? '—'}</p>
                        </div>
                    </div>
                </section>

                {/* 📋 Formulario de Registro */}
                <section className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6">Registrar nuevo empleado</h3>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Datos personales */}
                        <div className="col-span-2 text-lg font-medium text-gray-600">Datos personales</div>

                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} />
                        </div>

                        <div>
                            <Label htmlFor="dni">DNI</Label>
                            <Input id="dni" value={data.dni} onChange={e => setData('dni', e.target.value)} />
                            <InputError message={errors.dni} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
                            <InputError message={errors.address} />
                        </div>

                        {/* Rol */}
                        <div className="col-span-2">
                            <Label htmlFor="role">Rol</Label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-primary/50"
                            >
                                <option value="">Seleccionar rol</option>
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>

                            <InputError message={errors.role} />
                        </div>

                        {/* Fotografía */}
                        <div className="col-span-2">
                            <Label htmlFor="photograph">Fotografía</Label>
                            <Input
                                id="photograph"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('photograph', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.photograph} />
                        </div>

                        {/* Solo si es repartidor */}
                        {data.role === 'Repartidor' && (
                            <>
                                <div className="col-span-2 text-lg font-medium text-gray-600 pt-4">Datos de conducción</div>

                                <div>
                                    <Label htmlFor="license">Licencia</Label>
                                    <Input id="license" value={data.license} onChange={e => setData('license', e.target.value)} />
                                    <InputError message={errors.license} />
                                </div>

                                <div>
                                    <Label htmlFor="driver_license">Carnet de conducir</Label>
                                    <Input id="driver_license" value={data.driver_license} onChange={e => setData('driver_license', e.target.value)} />
                                    <InputError message={errors.driver_license} />
                                </div>

                                <div>
                                    <Label htmlFor="license_expiration_date">Vencimiento de licencia</Label>
                                    <Input id="license_expiration_date" type="date" value={data.license_expiration_date} onChange={e => setData('license_expiration_date', e.target.value)} />
                                    <InputError message={errors.license_expiration_date} />
                                </div>
                            </>
                        )}

                        <div className="col-span-2 flex justify-end mt-6">
                            <Button type="submit" disabled={processing}>
                                Crear empleado
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>

    );
}
