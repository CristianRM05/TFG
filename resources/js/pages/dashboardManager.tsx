import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

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
        <div className="min-h-screen bg-black text-white flex flex-col">
        <Head title="Inicio - Almacén" />

        {/* Navbar/Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-700">
          <h1 className="text-3xl font-extrabold uppercase">
            {user ? `Bienvenido, ${user.name}` : 'Almacén Pro'}
          </h1>
          <div>
            {user ? (
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="px-4 py-2 bg-amber-600 text-black font-semibold uppercase rounded-full hover:bg-amber-500 transition"
              >
                Cerrar Sesión
              </Link>
            ) : (
              <Link
                href={route('login')}
                className="px-4 py-2 bg-amber-600 text-black font-semibold uppercase rounded-full hover:bg-amber-500 transition"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow px-8 py-12">
          {user ? (
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ title, desc, link, img }) => (
              <Link
                key={link}
                href={link}
                className="group relative rounded-2xl overflow-hidden h-48 flex flex-col justify-between transition"
                style={{
                  backgroundImage: `url('${img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition" />

                {/* Contenido encima del overlay */}
                <div className="relative p-6">
                  <h2 className="text-2xl font-bold uppercase group-hover:text-amber-400 transition">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-200 group-hover:text-white transition">
                    {desc}
                  </p>
                </div>
              </Link>
            ))}
          </section>
          ) : (
            <div className="text-center mt-24">
              <p className="text-lg text-gray-400">
                Accede con tus credenciales para comenzar a trabajar.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Almacén Pro. Todos los derechos reservados.
        </footer>
      </div>
    );
  }
