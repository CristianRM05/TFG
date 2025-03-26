import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Tipo local para el usuario
type User = {
    name: string;
    last_name: string;
    number_employ: string;
    dni: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: string;
    departamento_id: number | null;
    license: string | null;
    driver_license: string | null;
    license_expiration_date: string | null;
    photograph?: string | null;
};

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    if (!auth?.user) {
        return <div>Cargando o no autenticado</div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 space-y-6">
                <h2 className="text-2xl font-bold">No es el panel de admin</h2>

            </div>
        </AppLayout>
    );
}
