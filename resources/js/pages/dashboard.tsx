import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type User = {
    name: string;
    last_name: string;
    number_employ: string;
    role: 'Manager' | 'Operario' | 'Repartidor';
    photograph?: string | null;
};

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    if (!auth?.user) {
        return <div className="p-6 text-center text-gray-500">Cargando datos del usuario...</div>;
    }

    const user = auth.user;

    // Función para determinar qué tarjetas mostrar según el rol
    const getCards = () => {
        switch (user.role) {
            case 'Manager':
                return [
                    { title: '📈 Movimientos', link: '/warehouse-movements' },
                    { title: '🧾 Pedidos', link: '/orders' },
                    { title: '🗂 Stock actual', link: '/stock' },
                    { title: '🏷️ Estanterías', link: '/shelves' },
                    { title: '📍 Rutas asignadas', link: '/routes' },
                ];
            case 'Operario':
                return [
                    { title: '📈 Movimientos', link: '/warehouse-movements' },
                    { title: '🗂 Stock actual', link: '/stock' },
                ];
            case 'Repartidor':
                return [
                    { title: '📍 Rutas asignadas', link: '/routes' },
                    { title: '📦 Productos a entregar', link: '/deliveries' },
                ];
            default:
                return [];
        }
    };

    const cards = getCards();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de trabajador" />

            <div className="p-6 space-y-8">
                <section className="flex items-center gap-4">
                    {user.photograph ? (
                        <img
                            src={`/storage/${user.photograph}`}
                            alt="Foto de perfil"
                            className="w-16 h-16 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold">
                            {user.name[0]}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Bienvenido, {user.name} {user.last_name}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Puesto: <strong>{user.role}</strong> · Nº Empleado: <strong>{user.number_employ}</strong>
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {cards.map((card) => (
                        <Card key={card.link} title={card.title} link={card.link} />
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}

type CardProps = {
    title: string;
    link: string;
};

function Card({ title, link }: CardProps) {
    return (
        <a
            href={link}
            className="block p-6 rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
            <h2 className="text-lg font-semibold">{title}</h2>
        </a>
    );
}
