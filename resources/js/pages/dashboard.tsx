import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import ProductList from './product/productList';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth.user;

    if (!auth?.user) {
        return <div className="p-6 text-center text-gray-500">Cargando datos del usuario...</div>;
    }
    if (auth.user) {
        const role = auth.user.role?.toString().toLowerCase() || '';
        if (role === 'admin') {
            router.visit('/admin/dashboard');
        } else if (role === 'manager') {
            router.visit('/manager/dashboard');
        } else {
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de trabajador" />
            <div className="p-6 space-y-8">
                <section>
                    <ProductList />
                </section>
            </div>
        </AppLayout>
    );
}
