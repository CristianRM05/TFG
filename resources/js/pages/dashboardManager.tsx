import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import AppLogo from '@/components/app-logo';
import AppLayout from '@/layouts/app-layout';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const user = auth?.user;

    //defino el contenido de cada card
    const cards = [
        {
          title: '📦 Descuentos',
          link: '/manager/discounts',
          desc: 'Gestiona todos los descuentos.',
          img: '/images/descuento.jpg',
        },
        {
          title: '🏷️ Estanterías',
          link: '/manager/shelves',
          desc: 'Asignar estanterías a productos.',
          img: '/images/estanterias.jpg',
        },
        {
          title: '📈 Movimientos',
          link: '/manager/movimientos',
          desc: 'Entradas y salidas.',
          img: '/images/balance.jpg',
        },
        {
          title: '🧾 Pedidos',
          link: '/manager/orders',
          desc: 'Pedidos pendientes y completados.',
          img: '/images/pedidos.png',
        },
        {
          title: '🗂 Stock',
          link: '/manager/stock',
          desc: 'Resumen del stock disponible.',
          img: '/images/stock.jpg',
        },
      ];

    return (
        <AppLayout>
<div className="min-h-screen text-neutral-900 dark:text-neutral-100 flex flex-col bg-transparent">        <Head title="Inicio - Almacén" />



        {/* Content */}
        <main className="flex-grow container mx-auto px-4 py-8 md:px-8 md:py-12">
          {user ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Panel de Control</h2>
              <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map(({ title, desc, link, img }) => (
                  <Link
                    key={link}
                    href={link}
                    className="group bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {title}
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </section>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16 space-y-6">
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Bienvenido a Almacén Pro</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  Accede con tus credenciales para comenzar a trabajar con nuestro sistema de gestión.
                </p>
                <Link
                  href={route('login')}
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-neutral-800 py-6 border-t border-neutral-200 dark:border-neutral-700">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Almacén Pro. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
    );
  }
