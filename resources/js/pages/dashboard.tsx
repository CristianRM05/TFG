import { router } from '@inertiajs/react';
import React, { useEffect, useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import ProductList from './product/productList';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth.user;
    const [scrollY, setScrollY] = useState(0);
    const productsRef = useRef<HTMLDivElement>(null);

    // Efecto para controlar el scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const parallaxOffset = scrollY * 0.5;
    const opacityValue = Math.max(1 - scrollY / 400, 0);

    // Función para manejar el scroll suave hacia la sección de productos
    const scrollToProducts = () => {
        if (productsRef.current) {
            // Calculamos la posición objetivo
            const targetPosition = productsRef.current.offsetTop;
            // Posición actual
            const startPosition = window.pageYOffset;
            // Distancia a recorrer
            const distance = targetPosition - startPosition;
            // Duración en milisegundos
            const duration = 1000;
            // Tiempo inicial
            let startTime: number | null = null;

            // Función de animación
            const animation = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Función de easing para un movimiento suave
                const easeInOutCubic = (t: number) => {
                    return t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                };

                // Calcular posición actual con easing
                const run = startPosition + distance * easeInOutCubic(progress);
                window.scrollTo(0, run);

                // Continuar la animación si no se ha completado
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    };

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
            // Usuario regular, continuar con el dashboard normal
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de trabajador" />

            <section
                className="
                    relative
                    bg-center bg-no-repeat bg-cover
                    h-[600px]
                    flex items-center justify-center
                    px-4
                    border-4 border-[#E17100]/30
                    rounded-2xl
                    overflow-hidden
                    transition-opacity duration-300
                "
                style={{
                    opacity: opacityValue
                }}
            >
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('/images/imgCatalogo.png')`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        transform: `translateY(${parallaxOffset}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />

                <div className="absolute inset-0 bg-black/10 z-1"></div>
            </section>

            {/* Indicador de scroll con funcionalidad de clic */}
            <div className="relative flex justify-center">
                <button
                    onClick={scrollToProducts}
                    className="absolute -top-12 bg-[#E17100] hover:bg-[#E17100]/80 text-white rounded-full p-3 shadow-lg cursor-pointer transition-colors duration-300"
                    style={{
                        opacity: Math.min(1, opacityValue * 2),
                        display: scrollY > 100 ? 'none' : 'block',
                        animation: 'slowBounce 3s infinite'
                    }}
                    aria-label="Desplazarse a los productos"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            </div>

            {/* Estilos para la animación lenta */}
            <style>{`
                @keyframes slowBounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-15px);
                    }
                    60% {
                        transform: translateY(-7px);
                    }
                }
            `}</style>

            {/* Contenedor con fondo claro para el listado con referencia */}
            <div
                ref={productsRef}
                className="w-full px-4 md:px-8 py-12 bg-[#F3F3DF]/10"
            >
                <ProductList />
            </div>
        </AppLayout>
    );
}
