// resources/js/Pages/PaginaBebidas.tsx
import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PaginaBebidas() {
  const { auth } = usePage<{ auth: { user?: { name: string } } }>().props;
  const [modalNewsletter, setModalNewsletter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [email, setEmail] = useState('');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSubscribe = async () => {
    try {
      await axios.post('/subscribe', { email });
      Swal.fire('¡Listo!', 'Te has suscrito con éxito 🎉', 'success');
      setEmail('');
      setModalNewsletter(false);
    } catch (e: any) {
      Swal.fire('Error', e.response?.data?.message ?? 'Algo salió mal', 'error');
    }
  };

  const categoriasBebidas = [
    {
      nombre: 'Bebidas Alcohólicas',
      descripcion: 'Licores premium, cervezas y vinos selectos',
      icono: '/images/icon-alcohol.svg',
      productos: [
        { nombre: 'Whisky Añejo', precio: '49.990 CLP', imagen: '/images/whisky.png' },
        { nombre: 'Cervezas Artesanales', precio: '25.000 CLP', imagen: '/images/cerveza.png' },
        { nombre: 'Vino Reserva', precio: '39.990 CLP', imagen: '/images/vino.png' },
      ],
    },
    {
      nombre: 'Bebidas Sin Alcohol',
      descripcion: 'Jugos naturales, sodas y smoothies',
      icono: '/images/icon-nalcohol.svg',
      productos: [
        { nombre: 'Smoothies Orgánicos', precio: '15.000 CLP', imagen: '/images/smoothie.png' },
        { nombre: 'Aguas Saborizadas', precio: '10.000 CLP', imagen: '/images/agua.png' },
        { nombre: 'Té Frío Artesanal', precio: '8.000 CLP', imagen: '/images/te.png' },
      ],
    },
  ];

  const beneficios = [
    { icono: '🚚', titulo: 'Envío Gratis', descripcion: 'En compras sobre 1200€' },
    { icono: '🍷', titulo: 'Asesoría', descripcion: 'Recomendaciones de expertos' },
    { icono: '🏆', titulo: 'Calidad', descripcion: 'Productos seleccionados' },
  ];

  const testimonios = [
    {
      nombre: 'María Fernández',
      comentario: 'La mejor selección de bebidas que he encontrado. ¡Increíble variedad!',
      avatar: '/images/avatar-maria.jpg',
    },
    {
      nombre: 'Carlos Mendoza',
      comentario: 'Servicio impecable y productos de primera calidad.',
      avatar: '/images/avatar-carlos.jpg',
    },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-800'} min-h-screen`}>
      <Head title="BebidasPro" />

      {/* Toggle Dark/Light */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Newsletter */}
      <button
        onClick={() => setModalNewsletter(true)}
        className="fixed bottom-20 right-4 z-50 bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 cursor-pointer"
      >
        📩 Newsletter
      </button>

      {/* Navbar */}
      <nav className="absolute top-0 w-full py-6 px-8 flex justify-between items-center z-20">
        <span className="text-4xl font-bold">🍹 BebidasPro</span>
        <div className="space-x-4">
          {auth.user ? (
            <Link href={route('dashboard')} className="inline-block px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors">
              Panel
            </Link>
          ) : (
            <>
              <Link href={route('login')} className="inline-block px-4 py-2 hover:underline">
                Iniciar Sesión
              </Link>
              <Link href={route('register')} className="inline-block px-4 py-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex items-center justify-center h-screen px-8">
        <img
          src="/images/botella-tequila.png"
          alt="Tequila"
          className="absolute bottom-0 w-1/2 opacity-90"
        />
        <div className="z-10 text-center max-w-xl">
          <h1 className="text-6xl font-extrabold mb-4">
            TRADITIONAL MEXICAN<br />TEQUILA<br /><span className="text-amber-400">Derbi Raho</span>
          </h1>
          <p className="mb-8 text-lg">100% Blue Agave | Crafted in Mexico | 40% ALC/VOL</p>
          <Link
            href={route('dashboard')}
            className="inline-block px-8 py-4 bg-amber-600 rounded-full uppercase tracking-wide text-white hover:bg-amber-700 transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </header>

      {/* Beneficios */}
      <section className="py-20 px-8 grid md:grid-cols-3 gap-8 text-center">
        {beneficios.map((b, i) => (
          <div key={i} className="p-6 bg-white/10 rounded-xl backdrop-blur-md">
            <div className="text-5xl mb-4">{b.icono}</div>
            <h3 className="text-2xl font-semibold mb-2">{b.titulo}</h3>
            <p>{b.descripcion}</p>
          </div>
        ))}
      </section>

      {/* Categorías */}
      <section className="py-20 px-8">
        {categoriasBebidas.map((cat, i) => (
          <div key={i} className="mb-16">
            <div className="flex items-center mb-6">
              <img src={cat.icono} alt="" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-3xl font-bold">{cat.nombre}</h2>
                <p className="text-sm">{cat.descripcion}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {cat.productos.map((p, j) => (
                <div key={j} className="bg-white/10 rounded-xl overflow-hidden shadow-lg">
                  <img src={p.imagen} alt={p.nombre} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">{p.nombre}</h3>
                    <p className="text-amber-400 font-bold">{p.precio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Testimonios */}
      <section className="py-20 px-8 bg-white/10">
        <h2 className="text-4xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonios.map((t, i) => (
            <div
              key={i}
              className="bg-black/50 rounded-xl p-8 text-center backdrop-blur-md"
            >
              <img
                src={t.avatar}
                alt={t.nombre}
                className="mx-auto w-16 h-16 rounded-full mb-4"
              />
              <p className="italic mb-4">"{t.comentario}"</p>
              <strong>{t.nombre}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Newsletter */}
      {modalNewsletter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-8 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">¡Suscríbete y recibe ofertas!</h2>
            <input
              type="email"
              placeholder="Tu correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-full"
            />
            <div className="flex justify-center space-x-4">
              <button onClick={handleSubscribe} className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
                Suscribirme
              </button>
              <button onClick={() => setModalNewsletter(false)} className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}