import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const user = auth?.user;

    return (
        <>
            <Head title="Inicio - Almacén" />

            <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900 text-gray-800 dark:text-white">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">
                            {user ? `Bienvenido, ${user.name} 👋` : 'Bienvenido al sistema de almacén'}
                        </h1>
                        {user ? (
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Cerrar sesión
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </header>

                    {user ? (
                        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card title="📦 Descuentos" link="/discounts" description="Gestiona todos los descuentos."/>
                            <Card title="🏷️ Estanterías" link="/shelves" description="Asignar estanterías a productos." />
                            <Card title="📈 Movimientos" link="/warehouse-movements" description="Entradas y salidas de productos." />
                            <Card title="🧾 Pedidos" link="/orders" description="Consulta pedidos pendientes y completados." />
                            <Card title="🗂 Stock actual" link="/stock" description="Resumen del stock disponible." />
                            <Card title="📍 Rutas" link="/routes" description="Consulta rutas asignadas a repartidores." />
                        </section>
                    ) : (
                        <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
                            Accede con tus credenciales para comenzar a trabajar.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

type CardProps = {
    title: string;
    description: string;
    link: string;
};

function Card({ title, description, link }: CardProps) {
    return (
        <Link
            href={link}
            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl p-6 shadow transition-all"
        >
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </Link>
    );
}
